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
const UpdatePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, password, new_password } = req.body;
        const user = yield userModel_1.default.getUserById(id);
        const { mem_password } = user;
        if (!user)
            return res.status(404).send({ message: "Not found user" });
        const passwordMatch = yield userModel_1.default.comparePassword(password, mem_password);
        if (passwordMatch) {
            const updatePass = yield userModel_1.default.updatePassword({ id, new_password });
            if (!updatePass)
                return res.status(500).send({ message: "Update password error" });
            res.status(200).send({ message: "Update password success" });
        }
        else
            res.status(200).send(false); //Password Incorrect
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
});
exports.default = UpdatePassword;
