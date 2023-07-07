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
const UpdateExpert = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mem_id, nametitle, rank, fname, lname, username, groupid } = req.body;
        const data = { mem_id, nametitle, rank, fname, lname, username, groupid };
        const update = yield expertModel_1.default.update(data);
        if (!update) {
            res.status(500).json({
                status: "500",
                message: "Error update expert",
            });
            return;
        }
        res.status(200).json({
            status: "200",
            message: "Expert update successfully",
        });
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
});
exports.default = UpdateExpert;
