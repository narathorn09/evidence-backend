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
const responseError_1 = __importDefault(require("../components/responseError"));
const { jwt: { secret }, } = require("config");
const jwt = require("jsonwebtoken");
const Auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const authHeader = req.headers.authorization || req.headers.Authorization;
        if (!((_a = `${authHeader}`) === null || _a === void 0 ? void 0 : _a.startsWith("Bearer ")))
            return res.status(401).json({
                status: 401,
                code: "Unauthorized",
                message: "Unauthorized",
            });
        const token = (_b = `${authHeader}`) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
        // console.log("token in check", token, authHeader);
        jwt.verify(token, secret, (err, decoded) => {
            if (err)
                return res.status(403).json({
                    status: 403,
                    code: "INVALID_TOKEN",
                    message: "Invalid Token",
                }); //invalid token
            if (decoded) {
                // console.log("decoded", decoded);
                next();
            }
        });
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
});
exports.default = Auth;
