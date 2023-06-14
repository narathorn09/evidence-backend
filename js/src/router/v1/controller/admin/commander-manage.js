"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCommander = exports.ListCommander = void 0;
const mysql_1 = require("../../../../db/mysql");
const ListCommander = (req, res, next) => {
    const query = "SELECT * FROM Commander";
    mysql_1.mysqlDB.query(query, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                status: "500",
                message: "Error get all admin",
            });
        }
        else {
            res.send(result);
        }
    });
};
exports.ListCommander = ListCommander;
const CreateCommander = (req, res, next) => {
    const { adminName } = req.query;
    const { memId } = req.body;
    mysql_1.mysqlDB.beginTransaction((err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({
                status: "500",
                message: "Error starting transaction",
            });
        }
        const adminQuery = "INSERT INTO Admin (admin_name, mem_id) VALUES (?, ?)";
        const adminData = [adminName, memId];
        mysql_1.mysqlDB.query(adminQuery, adminData, (err, resultAdmin) => {
            if (err) {
                console.log(err);
                mysql_1.mysqlDB.rollback(() => {
                    res.status(500).json({
                        status: "500",
                        message: "Error committing transaction",
                    });
                });
            }
            else {
                mysql_1.mysqlDB.commit((err) => {
                    if (err) {
                        console.log(err);
                        mysql_1.mysqlDB.rollback(() => {
                            res.status(500).json({
                                status: "500",
                                message: "Error committing transaction",
                            });
                        });
                    }
                    else {
                        res.status(200).json({
                            status: "200",
                            message: "Admin created successfully",
                            result: resultAdmin,
                        });
                    }
                });
            }
        });
    });
};
exports.CreateCommander = CreateCommander;
