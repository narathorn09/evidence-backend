"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetAdminById = exports.CreateAdmin = exports.ListAdmin = void 0;
const mysql_1 = require("../../../../db/mysql");
const bcrypt = require("bcrypt");
const ListAdmin = (req, res, next) => {
    const query = ` 
        SELECT *
        FROM Member
        JOIN Admin ON Member.mem_id = Admin.mem_id
      `;
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
exports.ListAdmin = ListAdmin;
const CreateAdmin = (req, res, next) => {
    try {
        const { admin_fname, admin_lname, username, password } = req.query;
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
            mysql_1.mysqlDB.beginTransaction((err) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({
                        status: "500",
                        message: "Error starting transaction",
                    });
                    return;
                }
                const memQuery = "INSERT INTO Member (mem_type, mem_username, mem_password) VALUES (?, ?, ?)";
                const memData = ["0", username, hash];
                mysql_1.mysqlDB.query(memQuery, memData, (err, resultMem) => {
                    if (err) {
                        console.log(err);
                        mysql_1.mysqlDB.rollback(() => {
                            res.status(500).json({
                                status: "500",
                                message: "Error creating member",
                            });
                            return;
                        });
                    }
                    const adminQuery = "INSERT INTO Admin (admin_fname, admin_lname, mem_id) VALUES (?, ?, ?)";
                    const adminData = [admin_fname, admin_lname, resultMem.insertId];
                    mysql_1.mysqlDB.query(adminQuery, adminData, (err, resultAdmin) => {
                        if (err) {
                            console.log(err);
                            mysql_1.mysqlDB.rollback(() => {
                                res.status(500).json({
                                    status: "500",
                                    message: "Error creating admin",
                                });
                                return;
                            });
                        }
                        mysql_1.mysqlDB.commit((err) => {
                            if (err) {
                                console.log(err);
                                mysql_1.mysqlDB.rollback(() => {
                                    res.status(500).json({
                                        status: "500",
                                        message: "Error committing transaction",
                                    });
                                    return;
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
                    });
                });
            });
        });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            status: "500",
            message: "Internal server error",
        });
    }
};
exports.CreateAdmin = CreateAdmin;
const GetAdminById = (req, res, next) => {
    const query = `
        SELECT *
        FROM Member
        JOIN Admin ON Member.mem_id = Admin.mem_id
        WHERE Member.mem_id = 4 AND Admin.mem_id = 4;
  `;
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
};
exports.GetAdminById = GetAdminById;
