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
const expertModel_1 = __importDefault(require("../../models/expertModel"));
const GetExpertById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { memId } = req.params;
        const expert = yield expertModel_1.default.getById(memId);
        if (!expert) {
            return res.status(500).json({
                status: "500",
                message: "Error get expert by Id",
            });
        }
        res.send(expert);
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
});
exports.default = GetExpertById;
