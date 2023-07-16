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
const typeEvidenceModel = {};
typeEvidenceModel.create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type_e_name } = data;
        const connection = yield mysql_1.mysqlDB.getConnection();
        const query = `INSERT INTO Type_Evidence (type_e_name) VALUES (?)`;
        const typeEvidenceData = [type_e_name];
        const [result] = yield connection.query(query, typeEvidenceData);
        if (!result) {
            yield connection.release();
            return null;
        }
        yield connection.release();
        return result;
    }
    catch (err) {
        throw err;
    }
});
typeEvidenceModel.update = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { type_e_id, type_e_name } = data;
        const connection = yield mysql_1.mysqlDB.getConnection();
        const query = `UPDATE Type_Evidence SET type_e_name = ? WHERE type_e_id = ?`;
        const typeEvidenceData = [type_e_name, type_e_id];
        const [result] = yield connection.query(query, typeEvidenceData);
        if (!result) {
            yield connection.release();
            return null;
        }
        yield connection.release();
        return result;
    }
    catch (err) {
        throw err;
    }
});
typeEvidenceModel.getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield mysql_1.mysqlDB.getConnection();
        const query = `SELECT * FROM Type_Evidence`;
        const [rows] = yield connection.query(query);
        yield connection.release();
        if (!rows)
            return null;
        return rows;
    }
    catch (err) {
        throw err;
    }
});
typeEvidenceModel.getById = (type_e_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield mysql_1.mysqlDB.getConnection();
        const query = `SELECT * FROM Type_Evidence WHERE type_e_id=${type_e_id}`;
        const [rows] = yield connection.query(query);
        yield connection.release();
        return rows ? rows : null;
    }
    catch (err) {
        throw err;
    }
});
typeEvidenceModel.deleteById = (type_e_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const connection = yield mysql_1.mysqlDB.getConnection();
        const query = `DELETE FROM Type_Evidence WHERE type_e_id=${type_e_id}`;
        const [result] = yield connection.query(query);
        yield connection.release();
        return result ? true : false;
    }
    catch (err) {
        throw err;
    }
});
exports.default = typeEvidenceModel;
