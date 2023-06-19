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
const Logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        // console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
        if (!cookies.refresh)
            return res.sendStatus(204); // No content
        const refreshToken = cookies.refresh;
        // Check if refreshToken exists in the database
        const query = `SELECT * FROM Member WHERE JSON_CONTAINS(refreshToken, ?)`;
        mysql_1.mysqlDB.query(query, [`"${refreshToken}"`], (err, result) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log(err);
                return res.sendStatus(500);
            }
            if (result.length === 0) {
                // for https
                res.clearCookie("refresh", {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                });
                // // for test IPv4
                // res.clearCookie("refresh", {
                //   httpOnly: false,
                //   secure: false,
                //   sameSite: "strict",
                //   domain: "172.22.118.24",
                // });
                return res.send("clearCookie");
            }
            const { mem_id } = result[0];
            // Delete refreshToken in the database
            const updateQuery = `UPDATE Member SET refreshToken = JSON_REMOVE(refreshToken, REPLACE(JSON_SEARCH(refreshToken, 'one', ?, NULL, '$**.refreshToken'), '".refreshToken"', '')) WHERE mem_id = ?`;
            mysql_1.mysqlDB.query(updateQuery, [`"${refreshToken}"`, mem_id], (err, result) => {
                if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                }
                console.log(result);
                res.clearCookie("refresh", {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                });
                res.status(200).json({
                    status: 200,
                    code: "success",
                    message: "success",
                });
            });
        }));
    }
    catch (e) {
        (0, responseError_1.default)(e, res);
    }
});
exports.default = Logout;
