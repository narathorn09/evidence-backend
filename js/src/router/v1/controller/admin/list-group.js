"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../../../../db/mysql");
const responseError_1 = __importDefault(require("../../components/responseError"));
const ListGroup = (req, res, next) => {
    try {
        const query = ` 
        SELECT
        GroupTable.group_id, GroupTable.group_name,
        Director.director_rank, Director.director_fname, Director.director_lname
        FROM GroupTable
        JOIN Director ON GroupTable.director_id = Director.director_id
      `;
        mysql_1.mysqlDB.query(query, (err, resulthavedirec) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    status: "500",
                    message: "Error get all group",
                });
            }
            else {
                const query = `SELECT * FROM GroupTable WHERE director_id IS NULL`;
                mysql_1.mysqlDB.query(query, (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({
                            status: "500",
                            message: "Error get all group without director",
                        });
                    }
                    res.send([...resulthavedirec, ...result]);
                });
            }
        });
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
};
exports.default = ListGroup;
