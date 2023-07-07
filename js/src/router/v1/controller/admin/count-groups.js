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
const CountGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const queryGroup = `SELECT COUNT(group_id) AS groupCount FROM GroupTable`;
        const [result] = yield mysql_1.mysqlDB.promise().query(queryGroup);
        const countG = (_b = (_a = result[0]) === null || _a === void 0 ? void 0 : _a.groupCount) !== null && _b !== void 0 ? _b : 0;
        res.json(countG);
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
});
exports.default = CountGroup;
