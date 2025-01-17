import { INestApplication, Module, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import * as express from "express";
import tgrid from "tgrid";
import { IPointer } from "tstl/functional/IPointer";

import { IPerformanceServerProgram } from "../IPerformanceServerProgram";

export const createNestExpressPerformanceProgram =
    (transform: boolean) => (port: number) => async (controller: () => any) => {
        const app: IPointer<INestApplication | null> = { value: null };

        const provider: IPerformanceServerProgram<any> = {
            open: async () => {
                app.value = await NestFactory.create(
                    (() => {
                        @Module({
                            controllers: [controller()],
                        })
                        class MyModule {}
                        return MyModule;
                    })(),
                    {
                        logger: false,
                    },
                );
                app.value.use(express.json({ limit: "50mb" }));
                if (transform)
                    app.value.useGlobalPipes(new ValidationPipe({ transform }));
                await app.value.listen(port);
                return port;
            },
            close: async () => {
                if (app.value) await app.value.close();
            },
        };

        // OPEN WORKER
        const worker = new tgrid.protocols.workers.WorkerServer();
        await worker.open(provider);
    };
