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
const adminModel_1 = __importDefault(require("../../models/adminModel"));
const ListAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield adminModel_1.default.getAll();
        if (!response) {
            return res.status(500).json({
                status: "500",
                message: "Error get all admin",
            });
        }
        res.send(response);
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
});
exports.default = ListAdmin;
