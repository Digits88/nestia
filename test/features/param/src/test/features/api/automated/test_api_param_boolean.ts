import typia, { Primitive } from "typia";

import api from "./../../../../api";

export const test_api_param_boolean = async (
    connection: api.IConnection
): Promise<void> => {
    const output: Primitive<false | true> = 
        await api.functional.param.boolean(
            connection,
            typia.random<Primitive<false | true>>(),
        );
    typia.assert(output);
};