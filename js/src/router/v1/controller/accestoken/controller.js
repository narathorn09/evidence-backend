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
exports.handleAccessToken = void 0;
const mysql_1 = require("../../../../db/mysql");
const responseError_1 = __importDefault(require("../../components/responseError"));
const jwtSign_1 = require("../../../../../config/jwtSign");
const { jwt: { secret }, } = require("config");
const jwt = require("jsonwebtoken");
const handleAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const query = `SELECT * FROM User WHERE refreshToken = '${refreshToken}'`;
        mysql_1.mysqlDB.query(query, (err, resultUser) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            if (resultUser.length === 0) {
                jwt.verify(refreshToken, secret, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                    if (err) {
                        return res.status(403).json({
                            status: 403,
                            code: "Forbidden",
                            message: "Forbidden",
                        });
                    }
                    console.log("attempted refresh token reuse!");
                    const hackedUserQuery = `SELECT * FROM User WHERE username = '${decoded.username}'`;
                    mysql_1.mysqlDB.query(hackedUserQuery, (err, resultHackedUser) => __awaiter(void 0, void 0, void 0, function* () {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        }
                        if (resultHackedUser.length > 0) {
                            const hackedUser = resultHackedUser[0];
                            hackedUser.refreshToken = [];
                            const updateQuery = `UPDATE User SET refreshToken = '${JSON.stringify(hackedUser.refreshToken)}' WHERE id = '${hackedUser.id}'`;
                            mysql_1.mysqlDB.query(updateQuery, (err, result) => {
                                if (err) {
                                    console.log(err);
                                    return res.sendStatus(500);
                                }
                                console.log(result);
                            });
                        }
                    }));
                    return res.status(403).json({
                        status: 403,
                        code: "Forbidden",
                        message: "Forbidden",
                    });
                }));
            }
            const foundUser = resultUser[0];
            const newRefreshTokenArray = foundUser.refreshToken.filter((rt) => rt !== refreshToken);
            jwt.verify(refreshToken, secret, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    console.log("expired refresh token");
                    const updateQuery = `UPDATE User SET refreshToken = '${JSON.stringify(newRefreshTokenArray)}' WHERE id = '${foundUser.id}'`;
                    mysql_1.mysqlDB.query(updateQuery, (err, result) => {
                        if (err) {
                            console.log(err);
                            return res.sendStatus(500);
                        }
                        console.log(result);
                    });
                }
                if (err || foundUser.id !== decoded.id) {
                    return res.status(403).json({
                        status: 403,
                        code: "Forbidden",
                        message: "Forbidden",
                    });
                }
                const accessToken = yield (0, jwtSign_1.jwtSign)({
                    id: foundUser.id,
                    role: foundUser.role,
                }, "1m");
                res.json({ roles: foundUser.role, accessToken });
            }));
        }));
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
});
exports.handleAccessToken = handleAccessToken;
