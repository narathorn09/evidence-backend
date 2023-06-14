"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const member_delete_1 = __importDefault(require("./controller/admin/member-delete"));
const admin_create_1 = __importDefault(require("./controller/admin/admin-create"));
const admin_list_1 = __importDefault(require("./controller/admin/admin-list"));
const admin_getbyid_1 = __importDefault(require("./controller/admin/admin-getbyid"));
const routerv1 = (0, express_1.Router)();
routerv1.route("/admin").post(admin_create_1.default).get(admin_list_1.default);
routerv1.route("/adminById").get(admin_getbyid_1.default);
routerv1.route("/memberById/:memId").delete(member_delete_1.default);
exports.default = routerv1;
