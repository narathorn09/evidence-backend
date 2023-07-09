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
const userModel = {};
userModel.getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield mysql_1.mysqlDB.query("SELECT * FROM Member WHERE mem_username = ?", [username]);
    return rows.length > 0 ? rows[0] : null;
});
userModel.getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield mysql_1.mysqlDB.query("SELECT * FROM Member WHERE mem_id = ?", [id]);
    return rows.length > 0 ? rows[0] : null;
});
userModel.deleteUserById = (memId) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `DELETE FROM Member WHERE mem_id=${memId}`;
    const [rows] = yield mysql_1.mysqlDB.query(query);
    return rows ? true : false;
});
userModel.comparePassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt.compare(password, hashedPassword);
});
userModel.getMe = (decode) => __awaiter(void 0, void 0, void 0, function* () {
    let query = "";
    switch (decode.role) {
        case "0": //admin
            query = `SELECT * FROM Member JOIN Admin ON Member.mem_id = Admin.mem_id  WHERE Member.mem_id = ${decode.id} AND Admin.mem_id = ${decode.id}`;
            break;
        case "1": //commander
            query = ` SELECT * FROM Member JOIN Commander ON Member.mem_id = Commander.mem_id WHERE Member.mem_id = ${decode.id} AND Commander.mem_id = ${decode.id}`;
            break;
        case "2": //Scene Investigator
            query = ` SELECT * FROM Member JOIN Scene_investigators ON Member.mem_id = Scene_investigators.mem_id WHERE Member.mem_id = ${decode.id} AND Scene_investigators.mem_id = ${decode.id}`;
            break;
        case "3": //Director
            query = ` SELECT * FROM Member JOIN Director ON Member.mem_id = Director.mem_id WHERE Member.mem_id = ${decode.id} AND Director.mem_id = ${decode.id}`;
            break;
        case "4": //Expert
            query = ` SELECT * FROM Member JOIN Expert ON Member.mem_id = Expert.mem_id WHERE Member.mem_id = ${decode.id} AND Expert.mem_id = ${decode.id}`;
            break;
        default:
            return null;
    }
    const [rows] = yield mysql_1.mysqlDB.query(query);
    if (!rows)
        return null;
    const member = rows[0];
    return {
        id: member.mem_id,
        role: member.mem_type,
        username: member.mem_username,
        fname: member.admin_fname ||
            member.com_fname ||
            member.director_fname ||
            member.inves_fname ||
            member.expert_fname,
        lname: member.admin_lname ||
            member.com_lname ||
            member.director_lname ||
            member.inves_lname ||
            member.expert_lname,
        nametitle: member.com_nametitle ||
            member.director_nametitle ||
            member.inves_nametitle ||
            member.expert_nametitle,
        rank: member.com_rank ||
            member.director_rank ||
            member.inves_rank ||
            member.expert_rank,
        groupid: member.group_id,
    };
});
userModel.updateProfile = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role, fname, lname, username, nametitle, rank } = data;
    let query = "";
    let queryData = [];
    switch (role) {
        case "0": //admin
            query = `UPDATE Admin SET admin_fname = ?, admin_lname = ? WHERE mem_id = ? `;
            queryData = [fname, lname, id];
            break;
        case "1": //commander
            query =
                "UPDATE Commander SET com_fname = ?, com_lname = ?, com_nametitle = ?, com_rank = ? WHERE mem_id = ? ";
            queryData = [fname, lname, nametitle, rank, id];
            break;
        case "2": //Scene Investigator
            query =
                "UPDATE Scene_investigators SET inves_fname = ?, inves_lname = ?, inves_nametitle = ?, inves_rank = ? WHERE mem_id = ?";
            queryData = [fname, lname, nametitle, rank, id];
            break;
        case "3": //Director
            query =
                "UPDATE Director SET director_fname = ?, director_lname = ?, director_nametitle = ?, director_rank = ? WHERE mem_id = ? ";
            queryData = [fname, lname, nametitle, rank, id];
            break;
        case "4": //Expert
            query =
                "UPDATE Expert SET expert_fname = ?, expert_lname = ?, expert_nametitle = ?, expert_rank = ? WHERE mem_id = ?";
            queryData = [fname, lname, nametitle, rank, id];
            break;
        default:
            return false;
    }
    try {
        const connection = yield mysql_1.mysqlDB.getConnection();
        try {
            yield connection.beginTransaction();
            const memQuery = "UPDATE Member SET mem_username = ? WHERE mem_id = ?";
            const memData = [username, id];
            const [resultMem] = yield connection.query(memQuery, memData);
            if (!resultMem) {
                yield connection.rollback();
                connection.release();
                return false;
            }
            const [rows] = yield mysql_1.mysqlDB.query(query, queryData);
            if (!rows) {
                yield connection.rollback();
                connection.release();
                return false;
            }
            yield connection.commit();
            yield connection.release();
            return true;
        }
        catch (err) {
            yield connection.rollback();
            yield connection.release();
            throw err;
        }
    }
    catch (err) {
        throw err;
    }
});
userModel.updatePassword = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, new_password } = data;
        const SALT_ROUNDS = 10;
        const hash = yield bcrypt.hash(new_password, SALT_ROUNDS);
        const connection = yield mysql_1.mysqlDB.getConnection();
        const memQuery = "UPDATE Member SET mem_password = ? WHERE mem_id = ?";
        const memData = [hash, id];
        const [result] = yield connection.query(memQuery, memData);
        if (!result) {
            connection.release();
            return false;
        }
        yield connection.release();
        return true;
    }
    catch (err) {
        throw err;
    }
});
userModel.logout = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const query = `SELECT * FROM RefreshToken WHERE refresh_token = ?`;
    const [rows] = yield mysql_1.mysqlDB.query(query, [refreshToken]);
    if (rows.length === 0)
        return null;
    const id = rows[0].mem_id;
    const updateQuery = `UPDATE RefreshToken SET refresh_token = ? WHERE mem_id = ?`;
    yield mysql_1.mysqlDB.query(updateQuery, [null, id]);
    return true;
});
exports.default = userModel;
