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
const responseError_1 = __importDefault(require("../../../../components/responseError"));
const jwtSign_1 = require("../../../../../config/jwtSign");
const userModel_1 = __importDefault(require("../../../../models/userModel"));
const refreshTokenModel_1 = __importDefault(require("../../../../models/refreshTokenModel"));
const authController = {};
authController.login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        const user = yield userModel_1.default.getUserByUsername(username);
        if (!user)
            return res.status(401).send({ message: "Invalid username" });
        const { mem_id, mem_type, mem_username, mem_password } = user;
        const passwordMatch = yield userModel_1.default.comparePassword(password, mem_password);
        if (passwordMatch) {
            const accessToken = yield (0, jwtSign_1.jwtSign)({
                id: mem_id,
                role: mem_type,
                username: mem_username,
            }, "1m");
            const newRefreshToken = yield (0, jwtSign_1.jwtSign)({
                id: mem_id,
                role: mem_type,
                username: mem_username,
            }, "1d");
            const foundRefresh = yield refreshTokenModel_1.default.findTokenById(mem_id);
            if (foundRefresh)
                yield refreshTokenModel_1.default.updateTokenById(mem_id, newRefreshToken);
            else
                yield refreshTokenModel_1.default.createTokenById(mem_id, newRefreshToken);
            res.cookie("refresh", newRefreshToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 24 * 60 * 60 * 1000,
            });
            return res.status(200).json({ mem_type, accessToken });
        }
        else {
            return res.status(401).send("Invalid password");
        }
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
});
exports.default = authController;
