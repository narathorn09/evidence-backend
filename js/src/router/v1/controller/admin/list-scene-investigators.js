"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../../../../db/mysql");
const responseError_1 = __importDefault(require("../../components/responseError"));
const ListSceneInvestigator = (req, res, next) => {
    try {
        const query = ` 
    SELECT
        Member.mem_id, Member.mem_type, Member.mem_username,
        Scene_investigators.inves_id, Scene_investigators.inves_nametitle, Scene_investigators.inves_rank,
        Scene_investigators.inves_fname, Scene_investigators.inves_lname,
        Scene_investigators.group_id, GroupTable.group_name
    FROM
        Member
    JOIN
        Scene_investigators ON Member.mem_id = Scene_investigators.mem_id
    LEFT JOIN
        GroupTable ON Scene_investigators.group_id = GroupTable.group_id;

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
exports.default = ListSceneInvestigator;
