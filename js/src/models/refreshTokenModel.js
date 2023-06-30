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
const refreshTokenModel = {};
refreshTokenModel.findTokenById = (mem_id) => __awaiter(void 0, void 0, void 0, function* () {
    const [rows] = yield mysql_1.mysqlDB.query("SELECT * FROM RefreshToken WHERE mem_id = ?", [mem_id]);
    return rows.length > 0 ? true : false;
});
refreshTokenModel.createTokenById = (mem_id, newRefreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield mysql_1.mysqlDB.query("INSERT INTO RefreshToken (mem_id, refresh_token, createdAt) VALUES (?, ?, CURRENT_TIMESTAMP(2))", [mem_id, newRefreshToken]);
        return rows ? true : false;
    }
    catch (error) {
        console.error("Error create refresh token:", error);
        return false;
    }
});
refreshTokenModel.updateTokenById = (mem_id, newRefreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [rows] = yield mysql_1.mysqlDB.query("UPDATE RefreshToken SET refresh_token = ?, createdAt = CURRENT_TIMESTAMP(2) WHERE mem_id = ?", [newRefreshToken, mem_id]);
        return rows.affectedRows > 0;
    }
    catch (error) {
        console.error("Error updating refresh token:", error);
        return false;
    }
});
exports.default = refreshTokenModel;
