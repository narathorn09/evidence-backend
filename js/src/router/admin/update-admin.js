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
const UpdateAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mem_id, admin_fname, admin_lname, username } = req.body;
        mysql_1.mysqlDB.beginTransaction((err) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    status: "500",
                    message: "Error starting transaction",
                });
                return;
            }
            const memQuery = "UPDATE Member SET mem_username = ? WHERE mem_id = ?";
            const memData = [username, mem_id];
            mysql_1.mysqlDB.query(memQuery, memData, (err, resultMem) => {
                if (err) {
                    console.log(err);
                    mysql_1.mysqlDB.rollback(() => {
                        res.status(500).json({
                            status: "500",
                            message: "Error update member",
                        });
                        return;
                    });
                }
                const adminQuery = "UPDATE Admin SET admin_fname = ?, admin_lname = ? WHERE mem_id = ? ";
                const adminData = [admin_fname, admin_lname, mem_id];
                mysql_1.mysqlDB.query(adminQuery, adminData, (err, resultAdmin) => {
                    if (err) {
                        console.log(err);
                        mysql_1.mysqlDB.rollback(() => {
                            res.status(500).json({
                                status: "500",
                                message: "Error update admin",
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
                                message: "Admin update successfully",
                            });
                        }
                    });
                });
            });
        });
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
});
exports.default = UpdateAdmin;
