import * as fs from "fs";
import { HashMap } from "tstl/container/HashMap";

import { IRoute } from "../structures/IRoute";
import { ImportDictionary } from "../utils/ImportDictionary";
import { FunctionGenerator } from "./FunctionGenerator";

export namespace FileGenerator
{
    /* ---------------------------------------------------------
        CONSTRUCTOR
    --------------------------------------------------------- */
    export async function generate(outDir: string, routeList: IRoute[]): Promise<void>
    {
        // CONSTRUCT FOLDER TREE
        const root: Directory = new Directory(null, "functional");
        for (const route of routeList)
            emplace(root, route);

        // RELOCATE FOR ONLY ONE CONTROLLER METHOD IN AN URL CASE
        relocate(root);

        // ITERATE FILES
        await iterate(outDir + "/functional", root);
    }

    function emplace(directory: Directory, route: IRoute): void
    {
        // SEPARATE IDENTIFIERS
        const identifiers: string[] = route.path
            .split("/")
            .filter(str => str[0] !== ":" && str.length !== 0)
            .map(str => str.split("-").join("_").split(".").join("_"));

        for (const key of identifiers)
        {
            // EMPLACE IF REQUIRED
            let it: HashMap.Iterator<string, Directory> = directory.directories.find(key);
            if (it.equals(directory.directories.end()) === true)
                it = directory.directories.emplace(key, new Directory(directory, key)).first;

            // FOR THE NEXT STEP
            directory = it.second;
        }
        directory.routes.push(route);
    }

    function relocate(directory: Directory): void
    {
        if (directory.parent !== null 
            && directory.directories.empty() 
            && directory.routes.length === 1
            && directory.name === directory.routes[0].name)
        {
            directory.parent.routes.push(directory.routes[0]);
            directory.parent.directories.erase(directory.name);
        }
        else if (directory.directories.empty() === false)
            for (const it of directory.directories)
                relocate(it.second);
    }

    /* ---------------------------------------------------------
        FILE ITERATOR
    --------------------------------------------------------- */
    async function iterate(outDir: string, directory: Directory): Promise<void>
    {
        // CREATE A NEW DIRECTORY
        try
        {
            await fs.promises.mkdir(outDir);
        }
        catch {}
        
        // ITERATE CHILDREN
        let content: string = "";
        for (const it of directory.directories)
        {
            await iterate(`${outDir}/${it.first}`, it.second);
            content += `export * as ${it.first} from "./${it.first}";\n`;
        }
        content += "\n";

        // ITERATE ROUTES
        const importDict: ImportDictionary = new ImportDictionary();
        for (const route of directory.routes)
        {
            for (const tuple of route.imports)
                for (const instance of tuple[1])
                    importDict.emplace(tuple[0], false, instance);
            content += FunctionGenerator.generate(route) + "\n\n";
        }

        // FINALIZE THE CONTENT
        if (directory.routes.length !== 0)
            content = ""
                + `import { AesPkcs5, Fetcher, Primitive } from "nestia-fetcher";\n`
                + `import type { IConnection } from "nestia-fetcher";\n`
                + 
                (
                    importDict.empty()
                        ? ""
                        : "\n" + importDict.toScript(outDir) + "\n"
                )
                + content + "\n\n"
                + "//---------------------------------------------------------\n"
                + "// TO PREVENT THE UNUSED VARIABLE ERROR\n"
                + "//---------------------------------------------------------\n"
                + "AesPkcs5;\n"
                + "Fetcher;\n"
                + "Primitive;";

        content = "/**\n"
            + " * @packageDocumentation\n"
            + ` * @module ${directory.module}\n`
            + " */\n"
            + "//================================================================\n"
            + content;
        await fs.promises.writeFile(`${outDir}/index.ts`, content, "utf8");
    }
}

class Directory
{
    public readonly module: string;
    public readonly directories: HashMap<string, Directory>;
    public readonly routes: IRoute[];

    public constructor(readonly parent: Directory | null, readonly name: string)
    {
        this.directories = new HashMap();
        this.routes = [];
        this.module = (this.parent !== null)
            ? `${this.parent.module}.${name}`
            : `api.${name}`;
    }
}