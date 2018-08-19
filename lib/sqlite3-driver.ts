import * as Promise from 'bluebird';
import * as sqlite3 from 'sqlite3';
import * as DBI from 'easydbi';

export interface SqliteOptions extends DBI.DriverOptions {
    memory ?: boolean;
    filePath ?: string;
}

export class Sqlite3Driver extends DBI.Driver {
    private readonly connection : string;
    private _inner : sqlite3.Database;
    constructor(key : string, options : SqliteOptions) {
        super(key, options);
        this.connection = this.makeConnectionString(options)
    }

    makeConnectionString(options : SqliteOptions) : string {
        //console.log('***** Sqlite3Driver.makeConnectionString', options);
        if (options.memory) {
            return ':memory'
        } else if (options.filePath) {
            return options.filePath
        } else {
            return ':memory'
        }
    }

    connectAsync() : Promise<Sqlite3Driver> {
        return new Promise<Sqlite3Driver>((resolve, reject) => {
            //console.log('**** Sqlite3Driver.connectAsync', this.connection)
            this._inner = new sqlite3.Database(this.connection, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(this);
                }
            })
        })        
    }

    isConnected() {
        return this._inner instanceof sqlite3.Database;
    }

    queryAsync(stmt : DBI.QueryType, args : DBI.QueryArgs = {}) : Promise<DBI.ResultRecord[]> {
        return new Promise<DBI.ResultRecord[]>((resolve, reject) => {
            let [ normStmt, normArgs ] = DBI.arrayify(stmt, args);
            this._inner.all(normStmt, normArgs, (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            });
        })
    }

    execAsync(stmt : DBI.QueryType, args : DBI.QueryArgs = {}) : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            let waitCallback = () => {
                this.execAsync(stmt, args)
                    .then(resolve)
                    .catch(reject)
            }
            let [ normStmt, normArgs ] = DBI.arrayify(stmt, args);
            this._inner.run(normStmt, normArgs, (err) => {
                if (err) {
                    if ((err as any).code === 'SQLITE_BUSY') {
                        setTimeout(waitCallback, 500);
                    } else {
                        reject(err)
                    }
                } else {
                    resolve()
                }
            })
        })
    }

    disconnectAsync() : Promise<void> {
        return new Promise<void>((resolve, reject) => {
            this._inner.close((err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            });
        })
    }

}

DBI.register('sqlite', Sqlite3Driver);
