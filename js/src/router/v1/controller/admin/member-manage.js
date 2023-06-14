"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMember = void 0;
const mysql_1 = require("../../../../db/mysql");
const DeleteMember = (req, res, next) => {
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
};
exports.DeleteMember = DeleteMember;
