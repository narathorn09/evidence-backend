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
const { jwt: { secret }, } = require("config");
const jwt = require("jsonwebtoken");
const GetMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // On client, also delete the accessToken
        const cookies = req.cookies;
        // console.log("cookie", cookies);
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refresh))
            return res.sendStatus(204); // No content
        const refreshToken = cookies.refresh;
        jwt.verify(refreshToken, secret, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log("refreshToken in cookies: ", err.message);
                res.clearCookie("refresh", {
                    httpOnly: true,
                    sameSite: "none",
                    secure: true,
                });
                return res.status(403).json({
                    status: 403,
                    code: "INVALID_TOKEN",
                    message: "Invalid Token",
                });
            }
            // console.log("decoded", decoded);
            let query = "";
            switch (decoded.role) {
                case "0": //admin
                    query = `SELECT * FROM Member JOIN Admin ON Member.mem_id = Admin.mem_id  WHERE Member.mem_id = ${decoded.id} AND Admin.mem_id = ${decoded.id}`;
                    break;
                case "1": //commander
                    query = ` SELECT * FROM Member JOIN Commander ON Member.mem_id = Commander.mem_id WHERE Member.mem_id = ${decoded.id} AND Commander.mem_id = ${decoded.id}`;
                    break;
                case "2": //Scene Investigator
                    query = ` SELECT * FROM Member JOIN Scene_investigators ON Member.mem_id = Scene_investigators.mem_id WHERE Member.mem_id = ${decoded.id} AND Scene_investigators.mem_id = ${decoded.id}`;
                    break;
                case "3": //Director
                    query = ` SELECT * FROM Member JOIN Director ON Member.mem_id = Director.mem_id WHERE Member.mem_id = ${decoded.id} AND Director.mem_id = ${decoded.id}`;
                    break;
                case "4": //Expert
                    query = ` SELECT * FROM Member JOIN Expert ON Member.mem_id = Expert.mem_id WHERE Member.mem_id = ${decoded.id} AND Expert.mem_id = ${decoded.id}`;
                    break;
                default:
                    res.status(403).json({
                        status: 403,
                        code: "INVALID_ROLE",
                        message: "Invalid Role",
                    });
                    break;
            }
            mysql_1.mysqlDB.query(query, (error, results) => __awaiter(void 0, void 0, void 0, function* () {
                if (error) {
                    console.log("Error in fetching user from database: ", error);
                    res.status(500).json({
                        status: 500,
                        code: "DATABASE_ERROR",
                        message: "Error in fetching user from database",
                    });
                }
                else {
                    // console.log("found in me", results[0]);
                    const member = results[0];
                    res.status(200).json({
                        id: member.mem_id,
                        role: member.mem_type,
                        username: member.mem_username,
                        fname: member.admin_fname ||
                            member.com_fname ||
                            member.director_fname ||
                            member.inves_fname ||
                            member.expert_fname,
                        lname: member.admin_lname ||
                            member.com_lname ||
                            member.director_lname ||
                            member.inves_lname ||
                            member.expert_lname,
                        nametitle: member.com_nametitle ||
                            member.director_nametitle ||
                            member.inves_nametitle ||
                            member.expert_nametitle,
                        rank: member.com_rank ||
                            member.director_rank ||
                            member.inves_rank ||
                            member.expert_rank,
                    });
                }
            }));
        }));
    }
    catch (e) {
        (0, responseError_1.default)(e, res);
    }
});
exports.default = GetMe;
