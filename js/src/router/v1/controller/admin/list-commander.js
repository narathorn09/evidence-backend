"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../../../../db/mysql");
const responseError_1 = __importDefault(require("../../../../components/responseError"));
const ListCommander = (req, res, next) => {
    try {
        const query = ` 
        SELECT 
        Member.mem_id, Member.mem_type, Member.mem_username,
        Commander.com_id, Commander.com_nametitle, Commander.com_rank, Commander.com_fname, Commander.com_lname
        FROM Member
        JOIN Commander ON Member.mem_id = Commander.mem_id
      `;
        mysql_1.mysqlDB.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    status: "500",
                    message: "Error get all commander",
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
exports.default = ListCommander;
