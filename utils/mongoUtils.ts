export const fixDBRes = <T>(dbRes) => JSON.parse(JSON.stringify(dbRes)) as T;
