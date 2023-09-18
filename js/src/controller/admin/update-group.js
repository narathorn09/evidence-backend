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
const groupModel_1 = __importDefault(require("../../models/groupModel"));
const UpdateGroup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { group_id, group_name, group_status, director_id } = req.body;
        const data = { group_id, group_name, group_status, director_id };
        const response = yield groupModel_1.default.update(data);
        if (!response) {
            return res.status(500).json({
                status: "500",
                message: "Error update group",
            });
        }
        res.status(200).json({
            status: "200",
            message: "Group update successfully",
        });
    }
    catch (err) {
        (0, responseError_1.default)(err, res);
    }
});
exports.default = UpdateGroup;
