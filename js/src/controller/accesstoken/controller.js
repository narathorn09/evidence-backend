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
const responseError_1 = __importDefault(require("../../components/responseError"));
const jwtSign_1 = require("../../../config/jwtSign");
const refreshTokenModel_1 = __importDefault(require("../../models/refreshTokenModel"));
const userModel_1 = __importDefault(require("../../models/userModel"));
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
        const findUserByToken = yield refreshTokenModel_1.default.findUserByToken(refreshToken);
        // console.log("findUserByToken",findUserByToken)
        if (!findUserByToken) {
            const decoded = yield jwt.verify(refreshToken, secret);
            if (!decoded)
                return res.status(403).json({
                    status: 403,
                    code: "Forbidden",
                    message: "Forbidden",
                });
            const hackedUser = yield userModel_1.default.getUserByUsername(decoded.username);
            const { mem_id } = hackedUser;
            yield refreshTokenModel_1.default.updateTokenById(mem_id, null);
            return res.status(403).json({
                status: 403,
                code: "Forbidden",
                message: "Forbidden",
            });
        }
        const { mem_id } = findUserByToken;
        const decoded = yield jwt.verify(refreshToken, secret);
        if (mem_id !== decoded.id) {
            return res.status(403).json({
                status: 403,
                code: "Forbidden",
                message: "Forbidden",
            });
        }
        const user = yield userModel_1.default.getUserByUsername(decoded.username);
        // console.log("user",user);
        if (user) {
            const { mem_id, mem_type, mem_username } = user;
            const accessToken = yield (0, jwtSign_1.jwtSign)({
                id: mem_id,
                role: mem_type,
                username: mem_username,
            }, "1m");
            return res.status(200).json({ mem_type, accessToken });
        }
        else {
            return res.status(403).json({
                status: 403,
                code: "Not Found",
                message: "User not found in DB",
            });
        }
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
});
exports.default = HandleAccessToken;
