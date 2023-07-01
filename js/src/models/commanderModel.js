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
const commanderModel = {};
commanderModel.create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nametitle, rank, fname, lname, username, password } = data;
        const hash = yield bcrypt.hash(password, SALT_ROUNDS);
        const connection = yield mysql_1.mysqlDB.getConnection();
        try {
            yield connection.beginTransaction();
            const memQuery = "INSERT INTO Member (mem_type, mem_username, mem_password) VALUES (?, ?, ?)";
            const memData = ["1", username, hash];
            const [resultMem] = yield connection.query(memQuery, memData);
            const commanderQuery = "INSERT INTO Commander (com_nametitle, com_rank, com_fname,com_lname,mem_id) VALUES (?, ?, ?, ?, ?)";
            const CommanderData = [nametitle, rank, fname, lname, resultMem.insertId];
            const [result] = yield connection.query(commanderQuery, CommanderData);
            yield connection.commit();
            connection.release();
            return result;
        }
        catch (err) {
            yield connection.rollback();
            connection.release();
            throw new Error("Error creating commander");
        }
    }
    catch (err) {
        throw new Error("Error creating commander");
    }
});
commanderModel.getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const query = ` 
        SELECT 
        Member.mem_id, Member.mem_type, Member.mem_username,
        Commander.com_id, Commander.com_nametitle, Commander.com_rank, Commander.com_fname, Commander.com_lname
        FROM Member
        JOIN Commander ON Member.mem_id = Commander.mem_id
  `;
    const [rows] = yield mysql_1.mysqlDB.query(query);
    return rows.length > 0 ? rows : [];
});
exports.default = commanderModel;
