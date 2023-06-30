"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql_1 = require("../../../../db/mysql");
const responseError_1 = __importDefault(require("../../../../components/responseError"));
const bcrypt = require("bcrypt");
const CreateAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { admin_fname, admin_lname, username, password } = req.body;
        const SALT_ROUNDS = 10;
        yield bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
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
        (0, responseError_1.default)(err, res);
    }
});
exports.default = CreateAdmin;
