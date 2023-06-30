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
const { jwt: { secret }, } = require("config");
const jwt = require("jsonwebtoken");
const userModel = {};
userModel.getUserByUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield mysql_1.mysqlDB.query("SELECT * FROM Member WHERE mem_username = ?", [username]);
    return rows.length > 0 ? rows[0] : null;
});
userModel.comparePassword = (password, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt.compare(password, hashedPassword);
});
userModel.getMe = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield jwt.verify(refreshToken, secret);
    if (!response)
        return null;
    let query = "";
    switch (response.role) {
        case "0": //admin
            query = `SELECT * FROM Member JOIN Admin ON Member.mem_id = Admin.mem_id  WHERE Member.mem_id = ${response.id} AND Admin.mem_id = ${response.id}`;
            break;
        case "1": //commander
            query = ` SELECT * FROM Member JOIN Commander ON Member.mem_id = Commander.mem_id WHERE Member.mem_id = ${response.id} AND Commander.mem_id = ${response.id}`;
            break;
        case "2": //Scene Investigator
            query = ` SELECT * FROM Member JOIN Scene_investigators ON Member.mem_id = Scene_investigators.mem_id WHERE Member.mem_id = ${response.id} AND Scene_investigators.mem_id = ${response.id}`;
            break;
        case "3": //Director
            query = ` SELECT * FROM Member JOIN Director ON Member.mem_id = Director.mem_id WHERE Member.mem_id = ${response.id} AND Director.mem_id = ${response.id}`;
            break;
        case "4": //Expert
            query = ` SELECT * FROM Member JOIN Expert ON Member.mem_id = Expert.mem_id WHERE Member.mem_id = ${response.id} AND Expert.mem_id = ${response.id}`;
            break;
        default:
            return null;
    }
    const [rows] = yield mysql_1.mysqlDB.query(query);
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
    };
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