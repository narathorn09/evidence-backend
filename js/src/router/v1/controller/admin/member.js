"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMember = exports.CreateMember = void 0;
const mysql_1 = require("../../../../db/mysql");
const bcrypt = require("bcrypt");
const CreateMember = (req, res, next) => {
    const { username, password, type } = req.query;
    const SALT_ROUNDS = 10;
    bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                status: "500",
                message: "Error hashing password",
            });
            return;
        }
        const memQuery = "INSERT INTO Member (mem_type, mem_username, mem_password) VALUES (?, ?, ?)";
        const memData = [type, username, hash];
        mysql_1.mysqlDB.query(memQuery, memData, (err, resultMem) => {
            if (err) {
                console.log(err);
                mysql_1.mysqlDB.rollback(() => {
                    res.status(500).json({
                        status: "500",
                        message: "Error creating member",
                    });
                });
                return;
            }
            // Pass resultMem.insertId to the next middleware
            req.body.memId = resultMem.insertId;
            next();
        });
    });
};
exports.CreateMember = CreateMember;
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
