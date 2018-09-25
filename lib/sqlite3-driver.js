"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Promise = require("bluebird");
var sqlite3 = require("sqlite3");
var DBI = require("easydbi");
function isSqliteOptions(v) {
    return DBI.isDriverOptions(v) && (v.memory ? typeof (v.memory) === 'boolean' : true) && (v.filePath ? typeof (v.filePath) === 'string' : true);
}
exports.isSqliteOptions = isSqliteOptions;
var Sqlite3Driver = /** @class */ (function (_super) {
    __extends(Sqlite3Driver, _super);
    function Sqlite3Driver(key, options) {
        var _this = _super.call(this, key, options) || this;
        if (isSqliteOptions(options)) {
            _this.connection = _this.makeConnectionString(options);
        }
        else {
            throw new Error("InvalidSqliteDriverOptions");
        }
        return _this;
    }
    Sqlite3Driver.prototype.makeConnectionString = function (options) {
        //console.log('***** Sqlite3Driver.makeConnectionString', options);
        if (options.memory) {
            return ':memory';
        }
        else if (options.filePath) {
            return options.filePath;
        }
        else {
            return ':memory';
        }
    };
    Sqlite3Driver.prototype.connectAsync = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            //console.log('**** Sqlite3Driver.connectAsync', this.connection)
            _this._inner = new sqlite3.Database(_this.connection, function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(_this);
                }
            });
        });
    };
    Sqlite3Driver.prototype.isConnected = function () {
        return this._inner instanceof sqlite3.Database;
    };
    Sqlite3Driver.prototype.queryAsync = function (stmt, args) {
        var _this = this;
        if (args === void 0) { args = {}; }
        return new Promise(function (resolve, reject) {
            var _a = DBI.arrayify(stmt, args), normStmt = _a[0], normArgs = _a[1];
            _this._inner.all(normStmt, normArgs, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    };
    Sqlite3Driver.prototype.execAsync = function (stmt, args) {
        var _this = this;
        if (args === void 0) { args = {}; }
        return new Promise(function (resolve, reject) {
            var waitCallback = function () {
                _this.execAsync(stmt, args)
                    .then(resolve)
                    .catch(reject);
            };
            var _a = DBI.arrayify(stmt, args), normStmt = _a[0], normArgs = _a[1];
            _this._inner.run(normStmt, normArgs, function (err) {
                if (err) {
                    if (err.code === 'SQLITE_BUSY') {
                        setTimeout(waitCallback, 500);
                    }
                    else {
                        reject(err);
                    }
                }
                else {
                    resolve();
                }
            });
        });
    };
    Sqlite3Driver.prototype.disconnectAsync = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this._inner.close(function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    };
    return Sqlite3Driver;
}(DBI.Driver));
exports.Sqlite3Driver = Sqlite3Driver;
DBI.register('sqlite', Sqlite3Driver);
//# sourceMappingURL=sqlite3-driver.js.map