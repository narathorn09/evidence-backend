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
const userModel_1 = __importDefault(require("../../models/userModel"));
const { jwt: { secret }, } = require("config");
const jwt = require("jsonwebtoken");
const GetMe = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const clearCook = () => {
        return new Promise((resolve, reject) => {
            res.clearCookie('refresh', {
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            });
            resolve();
        });
    };
    try {
        const cookies = req.cookies;
        if (!(cookies === null || cookies === void 0 ? void 0 : cookies.refresh))
            return res.sendStatus(204); // No content
        const refreshToken = cookies.refresh;
        yield jwt.verify(refreshToken, secret, (err, decode) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                clearCook();
                return res.sendStatus(403);
            } // Invalid token
            const me = yield userModel_1.default.getMe(decode);
            if (!me) {
                yield clearCook();
                return res.sendStatus(403);
            } // Invalid get me in db
            res.status(200).json(me);
        }));
    }
    catch (e) {
        yield clearCook();
        (0, responseError_1.default)(e, res);
    }
});
exports.default = GetMe;
