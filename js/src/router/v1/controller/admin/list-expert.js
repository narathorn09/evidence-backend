"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../../../../db/mysql");
const responseError_1 = __importDefault(require("../../../../components/responseError"));
const ListExpert = (req, res, next) => {
    try {
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
        mysql_1.mysqlDB.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    status: "500",
                    message: "Error get all scene investigator",
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
exports.default = ListExpert;
