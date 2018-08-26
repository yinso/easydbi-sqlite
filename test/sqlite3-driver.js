"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var mocha_typescript_1 = require("mocha-typescript");
var assert = require("assert");
var sql = require("../lib/sqlite3-driver");
var conn;
var Sqlite3DriverTest = /** @class */ (function () {
    function Sqlite3DriverTest() {
    }
    Sqlite3DriverTest.prototype.canConnect = function () {
        conn = new sql.Sqlite3Driver('test', {
            filePath: ':memory:'
        });
        return conn.connectAsync();
    };
    Sqlite3DriverTest.prototype.canCreateTable = function () {
        return conn.execAsync('create table test(c1 int, c2 int)')
            .then(function () { return conn.queryAsync('select * from test'); });
    };
    Sqlite3DriverTest.prototype.canInsert = function () {
        return conn.execAsync('insert into test values (1, 2), (3, 4)');
    };
    Sqlite3DriverTest.prototype.canSelect = function () {
        return conn.queryAsync('select * from test')
            .then(function (records) {
            assert.deepEqual([
                {
                    c1: 1,
                    c2: 2
                },
                {
                    c1: 3,
                    c2: 4
                }
            ], records);
        });
    };
    Sqlite3DriverTest.prototype.canGetSchema = function () {
        return conn.queryAsync('select * from sqlite_master', {})
            .then(function (results) {
            assert.deepEqual([
                {
                    type: 'table',
                    name: 'test',
                    tbl_name: 'test',
                    rootpage: 2,
                    sql: "CREATE TABLE test(c1 int, c2 int)"
                },
            ], results);
        });
    };
    Sqlite3DriverTest.prototype.canDisconnect = function () {
        return conn.disconnectAsync();
    };
    __decorate([
        mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Sqlite3DriverTest.prototype, "canConnect", null);
    __decorate([
        mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Sqlite3DriverTest.prototype, "canCreateTable", null);
    __decorate([
        mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Sqlite3DriverTest.prototype, "canInsert", null);
    __decorate([
        mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Sqlite3DriverTest.prototype, "canSelect", null);
    __decorate([
        mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Sqlite3DriverTest.prototype, "canGetSchema", null);
    __decorate([
        mocha_typescript_1.test,
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], Sqlite3DriverTest.prototype, "canDisconnect", null);
    Sqlite3DriverTest = __decorate([
        mocha_typescript_1.suite
    ], Sqlite3DriverTest);
    return Sqlite3DriverTest;
}());
//# sourceMappingURL=sqlite3-driver.js.map