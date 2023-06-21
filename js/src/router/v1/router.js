"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./middleware/auth"));
const controller_1 = __importDefault(require("./controller/me/controller"));
const controller_2 = __importDefault(require("./controller/login/controller"));
const controller_3 = __importDefault(require("./controller/logout/controller"));
const controller_4 = __importDefault(require("./controller/accesstoken/controller"));
// admin
const create_admin_1 = __importDefault(require("./controller/admin/create-admin"));
const create_commander_1 = __importDefault(require("./controller/admin/create-commander"));
const list_commander_1 = __importDefault(require("./controller/admin/list-commander"));
const list_admin_1 = __importDefault(require("./controller/admin/list-admin"));
const getbyid_admin_1 = __importDefault(require("./controller/admin/getbyid-admin"));
const delete_member_1 = __importDefault(require("./controller/admin/delete-member"));
const routerv1 = (0, express_1.Router)();
routerv1.route("/me").get(controller_1.default);
routerv1.route("/login").post(controller_2.default);
routerv1.route("/logout").get(auth_1.default, controller_3.default);
routerv1.route("/accesstoken").get(controller_4.default);
routerv1.route("/admin").post(create_admin_1.default).get(list_admin_1.default);
routerv1.route("/commander").post(create_commander_1.default).get(list_commander_1.default);
routerv1.route("/adminById").get(getbyid_admin_1.default);
routerv1.route("/memberById/:memId").delete(auth_1.default, delete_member_1.default);
exports.default = routerv1;
