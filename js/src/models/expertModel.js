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
const expertModel = {};
expertModel.create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nametitle, rank, fname, lname, username, password, groupid } = data;
        const hash = yield bcrypt.hash(password, SALT_ROUNDS);
        const connection = yield mysql_1.mysqlDB.getConnection();
        try {
            yield connection.beginTransaction();
            const memQuery = "INSERT INTO Member (mem_type, mem_username, mem_password) VALUES (?, ?, ?)";
            const memData = ["4", username, hash];
            const [resultMem] = yield connection.query(memQuery, memData);
            if (!resultMem) {
                yield connection.rollback();
                connection.release();
                return null;
            }
            const expertQuery = "INSERT INTO Expert (expert_nametitle, expert_rank, expert_fname, expert_lname, mem_id, group_id) VALUES (?, ?, ?, ?, ?, ?)";
            const expertData = [
                nametitle,
                rank,
                fname,
                lname,
                resultMem.insertId,
                groupid,
            ];
            const [result] = yield connection.query(expertQuery, expertData);
            if (!result) {
                yield connection.rollback();
                connection.release();
                return null;
            }
            yield connection.commit();
            connection.release();
            return result;
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
expertModel.getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = ` 
    SELECT
        m.mem_id, m.mem_type, m.mem_username,
        e.expert_id, e.expert_nametitle, e.expert_rank,
        e.expert_fname, e.expert_lname,
        e.group_id, g.group_name
    FROM
        Member m
    JOIN
        Expert e ON m.mem_id = e.mem_id
    LEFT JOIN
        GroupTable g ON g.group_id = e.group_id;
  `;
    const [rows] = yield mysql_1.mysqlDB.query(query);
    return rows.length > 0 ? rows : [];
});
exports.default = expertModel;
