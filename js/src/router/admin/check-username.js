"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../../../../db/mysql");
const responseError_1 = __importDefault(require("../../../../components/responseError"));
const CheckUsername = (req, res, next) => {
    try {
        const { username } = req.body;
        const query = `SELECT mem_username FROM Member WHERE mem_username = ?`;
        mysql_1.mysqlDB.query(query, [username], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    status: "500",
                    message: "Error check username",
                });
            }
            else {
                res.send(result);
            }
        });
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
};
exports.default = CheckUsername;
