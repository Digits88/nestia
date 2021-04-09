/**
 * @packageDocumentation
 * @module api.functional.performance
 */
//================================================================
import { AesPkcs5 } from "./../../__internal/AesPkcs5";
import { Fetcher } from "./../../__internal/Fetcher";
import { Primitive } from "./../../Primitive";
import type { IConnection } from "./../../IConnection";

import type { IPerformance } from "./../../structures/performance/IMemoryUsage";


/**
 * Get performance information of the server.
 * 
 * @return Performance information
 * 
 * @controller PerformanceController.get()
 * @path GET performance/
 */
export function get(connection: IConnection, ): Promise<get.Output>
{
    return Fetcher.fetch
    (
        connection,
        {"input_encrypted":false,"output_encrypted":true},
        "GET",
        `performance/`
    );
}
export namespace get
{
    export type Output = Primitive<IPerformance>;
}



//---------------------------------------------------------
// TO PREVENT THE UNUSED VARIABLE ERROR
//---------------------------------------------------------
AesPkcs5;
Fetcher;
Primitive;
