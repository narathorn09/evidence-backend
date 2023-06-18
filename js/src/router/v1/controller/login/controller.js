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
        // console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
        const { username, password } = req.body;
        const query = `SELECT * FROM Member WHERE mem_username = '${username}'`;
        mysql_1.mysqlDB.query(query, (err, resultMem) => {
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
            const { mem_id, mem_type, mem_username, mem_password, refreshToken: reToken, } = resultMem[0];
            bcrypt.compare(password, mem_password, (err, result) => __awaiter(void 0, void 0, void 0, function* () {
                if (result) {
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
                    //   let newRefreshTokenArray = !cookies?.refresh
                    //     ? reToken
                    //     : reToken.filter((rt: any) => rt !== cookies.refresh);
                    let newRefreshTokenArray = [];
                    if (Array.isArray(reToken)) {
                        newRefreshTokenArray = !(cookies === null || cookies === void 0 ? void 0 : cookies.refresh)
                            ? reToken
                            : reToken.filter((rt) => rt !== cookies.refresh);
                    }
                    else {
                        newRefreshTokenArray = [];
                    }
                    if (cookies === null || cookies === void 0 ? void 0 : cookies.refresh) {
                        const refreshToken = cookies.refresh;
                        const queryToken = `SELECT * FROM Member WHERE refreshToken = '${refreshToken}'`;
                        mysql_1.mysqlDB.query(queryToken, (err, resultToken) => __awaiter(void 0, void 0, void 0, function* () {
                            if (err) {
                                console.log(err);
                                return res.sendStatus(500);
                            }
                            if (resultToken.length === 0) {
                                console.log("attempted refresh token reuse at login!");
                                newRefreshTokenArray = [];
                            }
                            res.clearCookie("refresh", {
                                httpOnly: true,
                                sameSite: "none",
                                secure: true,
                            });
                        }));
                    }
                    const updateRefreshToken = [...newRefreshTokenArray, newRefreshToken];
                    const updateQuery = `UPDATE Member SET refreshToken = '${JSON.stringify(updateRefreshToken)}' WHERE mem_id = '${mem_id}'`;
                    mysql_1.mysqlDB.query(updateQuery, (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        }
                        // console.log(result);
                        // ############################################  for https
                        res.cookie("refresh", newRefreshToken, {
                            httpOnly: true,
                            secure: true,
                            sameSite: "none",
                            maxAge: 24 * 60 * 60 * 1000,
                        });
                        //    res.cookie("refresh", newRefreshToken, {
                        //      httpOnly: false,
                        //      secure: false,
                        //      sameSite: "strict",
                        //      maxAge: 24 * 60 * 60 * 1000,
                        //      domain: "localhost",
                        //      path: "/",
                        //    });
                        res.status(200).json({ mem_type, accessToken });
                    });
                }
                else {
                    return res.status(401).send("Invalid password");
                }
            }));
        });
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
});
exports.default = Login;
