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
const CountMember = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    try {
        const queryMem = `SELECT COUNT(mem_id) AS memCount FROM Member`;
        const queryAdmin = `SELECT COUNT(admin_id) AS adminCount FROM Admin`;
        const queryCom = `SELECT COUNT(com_id) AS comCount FROM Commander`;
        const queryDirec = `SELECT COUNT(director_id) AS directorCount FROM Director`;
        const queryInves = `SELECT COUNT(inves_id) AS invesCount FROM Scene_investigators`;
        const queryExpert = `SELECT COUNT(expert_id) AS expertCount FROM Expert`;
        const [memResult, adminResult, comResult, direcResult, invesResult, expertResult] = yield Promise.all([
            mysql_1.mysqlDB.promise().query(queryMem),
            mysql_1.mysqlDB.promise().query(queryAdmin),
            mysql_1.mysqlDB.promise().query(queryCom),
            mysql_1.mysqlDB.promise().query(queryDirec),
            mysql_1.mysqlDB.promise().query(queryInves),
            mysql_1.mysqlDB.promise().query(queryExpert),
        ]);
        const countMem = (_b = (_a = memResult[0][0]) === null || _a === void 0 ? void 0 : _a.memCount) !== null && _b !== void 0 ? _b : 0;
        const countAdmin = (_d = (_c = adminResult[0][0]) === null || _c === void 0 ? void 0 : _c.adminCount) !== null && _d !== void 0 ? _d : 0;
        const countCom = (_f = (_e = comResult[0][0]) === null || _e === void 0 ? void 0 : _e.comCount) !== null && _f !== void 0 ? _f : 0;
        const countDirec = (_h = (_g = direcResult[0][0]) === null || _g === void 0 ? void 0 : _g.directorCount) !== null && _h !== void 0 ? _h : 0;
        const countInves = (_k = (_j = invesResult[0][0]) === null || _j === void 0 ? void 0 : _j.invesCount) !== null && _k !== void 0 ? _k : 0;
        const countExpert = (_m = (_l = expertResult[0][0]) === null || _l === void 0 ? void 0 : _l.expertCount) !== null && _m !== void 0 ? _m : 0;
        res.json({
            countMem,
            countAdmin,
            countCom,
            countDirec,
            countInves,
            countExpert,
        });
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
});
exports.default = CountMember;
