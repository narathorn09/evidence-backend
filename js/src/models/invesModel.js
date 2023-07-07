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
const invesModel = {};
invesModel.create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nametitle, rank, fname, lname, username, password, groupid } = data;
        const hash = yield bcrypt.hash(password, SALT_ROUNDS);
        const connection = yield mysql_1.mysqlDB.getConnection();
        try {
            yield connection.beginTransaction();
            const memQuery = "INSERT INTO Member (mem_type, mem_username, mem_password) VALUES (?, ?, ?)";
            const memData = ["2", username, hash];
            const [resultMem] = yield connection.query(memQuery, memData);
            if (!resultMem) {
                yield connection.rollback();
                connection.release();
                return null;
            }
            const invesQuery = "INSERT INTO Scene_investigators (inves_nametitle, inves_rank, inves_fname, inves_lname, mem_id, group_id) VALUES (?, ?, ?, ?, ?, ?)";
            const invesData = [
                nametitle,
                rank,
                fname,
                lname,
                resultMem.insertId,
                groupid,
            ];
            const [result] = yield connection.query(invesQuery, invesData);
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
invesModel.update = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mem_id, nametitle, rank, fname, lname, username, groupid } = data;
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
            const invesQuery = "UPDATE Scene_investigators SET inves_nametitle = ?, inves_rank = ?, inves_fname = ?, inves_lname = ?, group_id = ? WHERE mem_id = ?";
            const invesData = [nametitle, rank, fname, lname, groupid, mem_id];
            const [result] = yield connection.query(invesQuery, invesData);
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
invesModel.getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = ` 
    SELECT
        Member.mem_id, Member.mem_type, Member.mem_username,
        Scene_investigators.inves_id, Scene_investigators.inves_nametitle, Scene_investigators.inves_rank,
        Scene_investigators.inves_fname, Scene_investigators.inves_lname,
        Scene_investigators.group_id, GroupTable.group_name
    FROM
        Member
    JOIN
        Scene_investigators ON Member.mem_id = Scene_investigators.mem_id
    LEFT JOIN
        GroupTable ON Scene_investigators.group_id = GroupTable.group_id;
  `;
    const [rows] = yield mysql_1.mysqlDB.query(query);
    if (!rows)
        return null;
    return rows;
});
invesModel.getById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const query = ` 
  SELECT
    Member.mem_id, Member.mem_type, Member.mem_username,
    Scene_investigators.inves_id, Scene_investigators.inves_nametitle, Scene_investigators.inves_rank,
    Scene_investigators.inves_fname, Scene_investigators.inves_lname,
    Scene_investigators.group_id, GroupTable.group_name
  FROM
    Member
  JOIN
    Scene_investigators ON Member.mem_id = Scene_investigators.mem_id
  LEFT JOIN
    GroupTable ON Scene_investigators.group_id = GroupTable.group_id
  WHERE Member.mem_id = ? AND Scene_investigators.mem_id = ?;
      `;
    const [rows] = yield mysql_1.mysqlDB.query(query, [id, id]);
    if (!rows)
        return null;
    return rows;
});
exports.default = invesModel;
