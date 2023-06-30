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
const CreateGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { group_name, director_id } = req.body;
        const query = `INSERT INTO GroupTable (group_name, director_id) VALUES (?, ?)`;
        mysql_1.mysqlDB.query(query, [group_name, director_id], (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({
                    status: "500",
                    message: "Error creating group",
                });
            }
            else {
                res.status(200).json({
                    status: "200",
                    message: "Director created successfully",
                    result: result,
                });
            }
        });
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
});
exports.default = CreateGroup;
