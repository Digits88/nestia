import api from "./../../../../api";

export const test_api_variable_$try_$try = async (
    connection: api.IConnection
): Promise<void> => {
    await api.functional.variable.$try.$try(
        connection,
    );
};