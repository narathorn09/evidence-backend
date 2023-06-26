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
const create_director_1 = __importDefault(require("./controller/admin/create-director"));
const list_admin_1 = __importDefault(require("./controller/admin/list-admin"));
const list_director_1 = __importDefault(require("./controller/admin/list-director"));
const list_commander_1 = __importDefault(require("./controller/admin/list-commander"));
const getbyid_admin_1 = __importDefault(require("./controller/admin/getbyid-admin"));
const delete_member_1 = __importDefault(require("./controller/admin/delete-member"));
const check_username_1 = __importDefault(require("./controller/admin/check-username"));
const list_group_1 = __importDefault(require("./controller/admin/list-group"));
const create_group_1 = __importDefault(require("./controller/admin/create-group"));
const delete_group_1 = __importDefault(require("./controller/admin/delete-group"));
const create_scene_investigators_1 = __importDefault(require("./controller/admin/create-scene-investigators"));
const list_scene_investigators_1 = __importDefault(require("./controller/admin/list-scene-investigators"));
const create_expert_1 = __importDefault(require("./controller/admin/create-expert"));
const list_expert_1 = __importDefault(require("./controller/admin/list-expert"));
const routerv1 = (0, express_1.Router)();
routerv1.route("/me").get(controller_1.default);
routerv1.route("/login").post(controller_2.default);
routerv1.route("/logout").get(auth_1.default, controller_3.default);
routerv1.route("/accesstoken").get(controller_4.default);
routerv1.route("/checkUsername").post(check_username_1.default);
routerv1.route("/group").post(auth_1.default, create_group_1.default).get(auth_1.default, list_group_1.default);
routerv1.route("/groupById/:groupId").delete(auth_1.default, delete_group_1.default);
routerv1.route("/admin").post(auth_1.default, create_admin_1.default).get(auth_1.default, list_admin_1.default);
routerv1.route("/commander").post(auth_1.default, create_commander_1.default).get(auth_1.default, list_commander_1.default);
routerv1.route("/director").post(auth_1.default, create_director_1.default).get(auth_1.default, list_director_1.default);
routerv1.route("/sceneInvestigator").post(auth_1.default, create_scene_investigators_1.default).get(auth_1.default, list_scene_investigators_1.default);
routerv1.route("/expert").post(auth_1.default, create_expert_1.default).get(auth_1.default, list_expert_1.default);
routerv1.route("/adminById").get(auth_1.default, getbyid_admin_1.default);
routerv1.route("/memberById/:memId").delete(auth_1.default, delete_member_1.default);
exports.default = routerv1;
