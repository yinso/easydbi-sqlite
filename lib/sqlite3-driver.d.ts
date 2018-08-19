import * as Promise from 'bluebird';
import * as DBI from 'easydbi';
export interface SqliteOptions extends DBI.DriverOptions {
    memory?: boolean;
    filePath?: string;
}
export declare class Sqlite3Driver extends DBI.Driver {
    private readonly connection;
    private _inner;
    constructor(key: string, options: SqliteOptions);
    makeConnectionString(options: SqliteOptions): string;
    connectAsync(): Promise<Sqlite3Driver>;
    isConnected(): boolean;
    queryAsync(stmt: DBI.QueryType, args?: DBI.QueryArgs): Promise<DBI.ResultRecord[]>;
    execAsync(stmt: DBI.QueryType, args?: DBI.QueryArgs): Promise<void>;
    disconnectAsync(): Promise<void>;
}
