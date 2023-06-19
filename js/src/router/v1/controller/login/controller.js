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
const responseError_1 = __importDefault(require("../../components/responseError"));
const jwtSign_1 = require("../../../../../config/jwtSign");
const bcrypt = require("bcrypt");
const Login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        const { username, password } = req.body;
        const query = `SELECT * FROM Member WHERE mem_username = ?`;
        mysql_1.mysqlDB.query(query, [username], (err, resultMem) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    status: "400",
                    message: "Error querying from db",
                });
            }
            if (resultMem.length === 0) {
                return res.status(401).send({ message: "Invalid username" });
            }
            const { mem_id, mem_type, mem_username, mem_password } = resultMem[0];
            try {
                const passwordMatch = yield bcrypt.compareSync(password, mem_password);
                if (passwordMatch) {
                    const accessToken = yield (0, jwtSign_1.jwtSign)({
                        id: mem_id,
                        role: mem_type,
                        username: mem_username,
                    }, "1m");
                    const newRefreshToken = yield (0, jwtSign_1.jwtSign)({
                        id: mem_id,
                        role: mem_type,
                        username: mem_username,
                    }, "1d");
                    const findTokenQuery = `SELECT * FROM RefreshToken WHERE mem_id = ?`;
                    mysql_1.mysqlDB.query(findTokenQuery, [mem_id], (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.status(500).json({
                                status: "500",
                                message: "Error querying RefreshToken from db",
                            });
                        }
                        if (result.length > 0) {
                            const updateQuery = `UPDATE RefreshToken SET refresh_token = ?, createdAt = CURRENT_TIMESTAMP(2) WHERE mem_id = ?`;
                            mysql_1.mysqlDB.query(updateQuery, [newRefreshToken, mem_id], (err, result) => {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).json({
                                        status: "500",
                                        message: "Error updating RefreshToken in db",
                                    });
                                }
                                console.log("UPDATE RefreshToken");
                            });
                        }
                        else {
                            const insertTokenQuery = "INSERT INTO RefreshToken (mem_id, refresh_token, createdAt) VALUES (?, ?, CURRENT_TIMESTAMP(2))";
                            mysql_1.mysqlDB.query(insertTokenQuery, [mem_id, newRefreshToken], (err, result) => {
                                if (err) {
                                    console.log(err);
                                    return res.status(500).json({
                                        status: "500",
                                        message: "Error inserting RefreshToken into db",
                                    });
                                }
                                console.log("INSERT RefreshToken");
                            });
                        }
                    });
                    // Set refresh token as a secure HTTP-only cookie
                    res.cookie("refresh", newRefreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "none",
                        maxAge: 24 * 60 * 60 * 1000,
                    });
                    return res.status(200).json({ mem_type, accessToken });
                }
                else {
                    return res.status(401).send("Invalid password");
                }
            }
            catch (err) {
                console.log(err);
                return res.status(500).json({
                    status: "500",
                    message: "Error comparing passwords",
                });
            }
        }));
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
});
exports.default = Login;
