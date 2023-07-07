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
const mysql_1 = require("../../db/mysql");
const responseError_1 = __importDefault(require("../../components/responseError"));
const jwtSign_1 = require("../../../config/jwtSign");
const { jwt: { secret }, } = require("config");
const jwt = require("jsonwebtoken");
const HandleAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refresh)) {
            return res.status(401).json({
                status: 401,
                code: "Unauthorized",
                message: "Unauthorized",
            });
        }
        const refreshToken = cookies.refresh;
        const query = `SELECT * FROM RefreshToken WHERE refresh_token = ?`;
        mysql_1.mysqlDB.query(query, [refreshToken], (err, resultMember) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            if (resultMember.length === 0) {
                try {
                    const decoded = jwt.verify(refreshToken, secret);
                    console.log("attempted refresh token reuse!");
                    const hackedUserQuery = `SELECT * FROM Member WHERE mem_username = '${decoded.username}'`;
                    mysql_1.mysqlDB.query(hackedUserQuery, (err, resultHackedUser) => __awaiter(void 0, void 0, void 0, function* () {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        }
                        if (resultHackedUser.length > 0) {
                            const { mem_id, mem_type, mem_username, mem_password } = resultHackedUser[0];
                            const updateQuery = `UPDATE RefreshToken SET refresh_token = ? WHERE mem_id = ?`;
                            mysql_1.mysqlDB.query(updateQuery, [null, mem_id], (err, result) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                }
                                // console.log(result);
                            });
                        }
                    }));
                    return res.status(403).json({
                        status: 403,
                        code: "Forbidden",
                        message: "Forbidden",
                    });
                }
                catch (err) {
                    return res.status(403).json({
                        status: 403,
                        code: "Forbidden",
                        message: "Forbidden",
                    });
                }
            }
            const { mem_id } = resultMember[0];
            try {
                const decoded = jwt.verify(refreshToken, secret);
                if (mem_id !== decoded.id) {
                    return res.status(403).json({
                        status: 403,
                        code: "Forbidden",
                        message: "Forbidden",
                    });
                }
                const UserQuery = `SELECT * FROM Member WHERE mem_username = '${decoded.username}'`;
                mysql_1.mysqlDB.query(UserQuery, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    if (result.length > 0) {
                        const { mem_type, mem_username } = result[0];
                        const accessToken = yield (0, jwtSign_1.jwtSign)({
                            id: mem_id,
                            role: mem_type,
                            username: mem_username,
                        }, "1m");
                        return res.json({ mem_type, accessToken });
                    }
                    else {
                        return res.status(404).json({
                            status: 404,
                            code: "Not Found",
                            message: "User not found",
                        });
                    }
                }));
            }
            catch (err) {
                console.log("expired refresh token");
                const updateQuery = `UPDATE RefreshToken SET refresh_token = ? WHERE mem_id = ?`;
                mysql_1.mysqlDB.query(updateQuery, [null, mem_id], (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                    }
                    console.log("expired refresh token please login");
                    return res.status(403).json({
                        status: 403,
                        code: "Forbidden",
                        message: "Forbidden",
                    });
                });
            }
        }));
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
});
exports.default = HandleAccessToken;
