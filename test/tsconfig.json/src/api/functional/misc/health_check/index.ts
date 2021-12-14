/**
 * @packageDocumentation
 * @module api.functional.misc.health_check
 */
//================================================================
import { AesPkcs5, Fetcher, Primitive } from "nestia-fetcher";
import type { IConnection } from "nestia-fetcher";

/**
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 * @controller HealthCheckController.get()
 * @path GET /misc/health-check
 */
export function get
    (
        connection: IConnection
    ): Promise<void>
{
    return Fetcher.fetch
    (
        connection,
        get.ENCRYPTED,
        get.METHOD,
        get.path()
    );
}
export namespace get
{

    export const METHOD = "GET" as const;
    export const PATH: string = "/misc/health-check";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(): string
    {
        return `/misc/health-check`;
    }
}

/**
 * @nestia Generated by Nestia - https://github.com/samchon/nestia
 * @controller HealthCheckController.sleep_for()
 * @path GET /misc/health-check/sleep-for/:ms
 */
export function sleep_for
    (
        connection: IConnection,
        ms: number
    ): Promise<void>
{
    return Fetcher.fetch
    (
        connection,
        sleep_for.ENCRYPTED,
        sleep_for.METHOD,
        sleep_for.path(ms)
    );
}
export namespace sleep_for
{

    export const METHOD = "GET" as const;
    export const PATH: string = "/misc/health-check/sleep-for/:ms";
    export const ENCRYPTED: Fetcher.IEncrypted = {
        request: false,
        response: false,
    };

    export function path(ms: number): string
    {
        return `/misc/health-check/sleep-for/${ms}`;
    }
}



//---------------------------------------------------------
// TO PREVENT THE UNUSED VARIABLE ERROR
//---------------------------------------------------------
AesPkcs5;
Fetcher;
Primitive;