"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../../../../db/mysql");
const responseError_1 = __importDefault(require("../../../../components/responseError"));
const GetAdminById = (req, res, next) => {
    try {
        const query = `
        SELECT *
        FROM Member
        JOIN Admin ON Member.mem_id = Admin.mem_id
        WHERE Member.mem_id = 4 AND Admin.mem_id = 4`;
        mysql_1.mysqlDB.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    status: "500",
                    message: "Error get admin by Id",
                });
            }
            else {
                res.send(Object.assign({}, result[0]));
            }
        });
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
};
exports.default = GetAdminById;
