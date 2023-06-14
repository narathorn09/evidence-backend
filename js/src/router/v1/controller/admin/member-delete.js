"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../../../../db/mysql");
const responseError_1 = __importDefault(require("../../components/responseError"));
const DeleteMember = (req, res, next) => {
    try {
        const { memId } = req.params;
        const query = `DELETE FROM Member WHERE mem_id=${memId}`;
        mysql_1.mysqlDB.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    status: "500",
                    message: "Error delete member",
                });
            }
            else {
                res.status(200).json({
                    status: "200",
                    message: "Delete member success",
                });
            }
        });
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
};
exports.default = DeleteMember;
