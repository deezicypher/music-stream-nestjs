export const connection: Connection = {
    CONNECTION_STRING: 'CONNECTION_STRING',
    DB: 'MYSQL',
    DB_NAME: 'TEST'
};

export type Connection = {
    CONNECTION_STRING: string;
    DB: string;
    DB_NAME: string;
};