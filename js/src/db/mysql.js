"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mysqlDB = void 0;
const mysql = require("mysql2/promise");
const { db: { db_host, db_user, db_pass, db_name }, } = require("config");
exports.mysqlDB = mysql.createPool({
    host: db_host,
    user: db_user,
    password: db_pass,
    database: db_name,
});
