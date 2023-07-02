"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../db/mysql");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;
const adminModel = {};
adminModel.create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { admin_fname, admin_lname, username, password } = data;
        const hash = yield bcrypt.hash(password, SALT_ROUNDS);
        const connection = yield mysql_1.mysqlDB.getConnection();
        try {
            yield connection.beginTransaction();
            const memQuery = "INSERT INTO Member (mem_type, mem_username, mem_password) VALUES (?, ?, ?)";
            const memData = ["0", username, hash];
            const [resultMem] = yield connection.query(memQuery, memData);
            if (!resultMem) {
                yield connection.rollback();
                connection.release();
                return null;
            }
            const adminQuery = "INSERT INTO Admin (admin_fname, admin_lname, mem_id) VALUES (?, ?, ?)";
            const adminData = [admin_fname, admin_lname, resultMem.insertId];
            const [resultAdmin] = yield connection.query(adminQuery, adminData);
            if (!resultAdmin) {
                yield connection.rollback();
                connection.release();
                return null;
            }
            yield connection.commit();
            connection.release();
            return resultAdmin;
        }
        catch (err) {
            yield connection.rollback();
            connection.release();
            throw err;
        }
    }
    catch (err) {
        throw err;
    }
});
adminModel.update = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mem_id, admin_fname, admin_lname, username } = data;
        const connection = yield mysql_1.mysqlDB.getConnection();
        try {
            yield connection.beginTransaction();
            const memQuery = "UPDATE Member SET mem_username = ? WHERE mem_id = ?";
            const memData = [username, mem_id];
            const [resultMem] = yield connection.query(memQuery, memData);
            if (!resultMem) {
                yield connection.rollback();
                connection.release();
                return null;
            }
            const adminQuery = "UPDATE Admin SET admin_fname = ?, admin_lname = ? WHERE mem_id = ? ";
            const adminData = [admin_fname, admin_lname, mem_id];
            const [resultAdmin] = yield connection.query(adminQuery, adminData);
            if (!resultAdmin) {
                yield connection.rollback();
                connection.release();
                return null;
            }
            yield connection.commit();
            connection.release();
            return resultAdmin;
        }
        catch (err) {
            yield connection.rollback();
            connection.release();
            throw err;
        }
    }
    catch (err) {
        throw err;
    }
});
adminModel.getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = ` 
        SELECT
        Member.mem_id, Member.mem_type, Member.mem_username, 
        Admin.admin_id, Admin.admin_fname, Admin.admin_lname
        FROM Member
        JOIN Admin ON Member.mem_id = Admin.mem_id;    
      `;
    const [rows] = yield mysql_1.mysqlDB.query(query);
    if (!rows)
        return null;
    return rows;
});
adminModel.getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = ` 
        SELECT
        Member.mem_id, Member.mem_type, Member.mem_username, 
        Admin.admin_id, Admin.admin_fname, Admin.admin_lname
        FROM Member
        JOIN Admin ON Member.mem_id = Admin.mem_id
        WHERE Member.mem_id = ? AND Admin.mem_id = ?;
      `;
    const [rows] = yield mysql_1.mysqlDB.query(query, [id, id]);
    if (!rows)
        return null;
    return rows;
});
exports.default = adminModel;
