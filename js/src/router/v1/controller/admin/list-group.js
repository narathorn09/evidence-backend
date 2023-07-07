"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../../../../db/mysql");
const responseError_1 = __importDefault(require("../../../../components/responseError"));
const ListGroup = (req, res, next) => {
    try {
        const query = ` 
    SELECT
      g.group_id, g.group_name,
      d.director_rank, d.director_fname, d.director_lname
    FROM
        GroupTable g
    LEFT JOIN
        Director d ON g.director_id = d.director_id;
      `;
        mysql_1.mysqlDB.query(query, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    status: "500",
                    message: "Error get all group",
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
exports.default = ListGroup;
