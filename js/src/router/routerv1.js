"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../middleware/auth"));
const controller_1 = __importDefault(require("../controller/accesstoken/controller"));
const controller_2 = __importDefault(require("../controller/me/controller"));
const controller_3 = __importDefault(require("../controller/logout/controller"));
const controller_4 = __importDefault(require("../controller/login/controller"));
// admin
const create_admin_1 = __importDefault(require("../controller/admin/create-admin"));
const create_commander_1 = __importDefault(require("../controller/admin/create-commander"));
const create_director_1 = __importDefault(require("../controller/admin/create-director"));
const list_admin_1 = __importDefault(require("../controller/admin/list-admin"));
const list_director_1 = __importDefault(require("../controller/admin/list-director"));
const list_commander_1 = __importDefault(require("../controller/admin/list-commander"));
const delete_member_1 = __importDefault(require("../controller/admin/delete-member"));
const check_username_1 = __importDefault(require("../controller/admin/check-username"));
const list_group_1 = __importDefault(require("../controller/admin/list-group"));
const create_group_1 = __importDefault(require("../controller/admin/create-group"));
const delete_group_1 = __importDefault(require("../controller/admin/delete-group"));
const create_scene_investigators_1 = __importDefault(require("../controller/admin/create-scene-investigators"));
const list_scene_investigators_1 = __importDefault(require("../controller/admin/list-scene-investigators"));
const create_expert_1 = __importDefault(require("../controller/admin/create-expert"));
const list_expert_1 = __importDefault(require("../controller/admin/list-expert"));
const count_member_1 = __importDefault(require("../controller/admin/count-member"));
const count_groups_1 = __importDefault(require("../controller/admin/count-groups"));
const update_admin_1 = __importDefault(require("../controller/admin/update-admin"));
const update_commander_1 = __importDefault(require("../controller/admin/update-commander"));
const update_director_1 = __importDefault(require("../controller/admin/update-director"));
const getbyid_admin_1 = __importDefault(require("../controller/admin/getbyid-admin"));
const getbyid_commander_1 = __importDefault(require("../controller/admin/getbyid-commander"));
const getbyid_director_1 = __importDefault(require("../controller/admin/getbyid-director"));
const getbyid_scene_investigators_1 = __importDefault(require("../controller/admin/getbyid-scene-investigators"));
const update_scene_investigators_1 = __importDefault(require("../controller/admin/update-scene-investigators"));
const getbyid_expert_1 = __importDefault(require("../controller/admin/getbyid-expert"));
const update_expert_1 = __importDefault(require("../controller/admin/update-expert"));
const getbyid_group_1 = __importDefault(require("../controller/admin/getbyid-group"));
const update_group_1 = __importDefault(require("../controller/admin/update-group"));
const update_profile_1 = __importDefault(require("../controller/me/update-profile"));
const routerv1 = (0, express_1.Router)();
routerv1.route("/me").get(controller_2.default);
routerv1.route("/login").post(controller_4.default);
routerv1.route("/logout").get(controller_3.default);
routerv1.route("/accesstoken").get(controller_1.default);
routerv1.route("/profile").put(auth_1.default, update_profile_1.default);
// admin
routerv1.route("/checkUsername").post(check_username_1.default);
routerv1.route("/countMember").get(count_member_1.default);
routerv1.route("/countGroup").get(count_groups_1.default);
routerv1.route("/group").post(auth_1.default, create_group_1.default).get(auth_1.default, list_group_1.default).put(auth_1.default, update_group_1.default);
routerv1.route("/groupById/:groupId").get(auth_1.default, getbyid_group_1.default).delete(auth_1.default, delete_group_1.default);
routerv1.route("/admin").post(create_admin_1.default).get(auth_1.default, list_admin_1.default).put(auth_1.default, update_admin_1.default);
routerv1.route("/commander").post(auth_1.default, create_commander_1.default).get(auth_1.default, list_commander_1.default).put(auth_1.default, update_commander_1.default);
routerv1.route("/director").post(auth_1.default, create_director_1.default).get(auth_1.default, list_director_1.default).put(auth_1.default, update_director_1.default);
routerv1.route("/sceneInvestigator").post(auth_1.default, create_scene_investigators_1.default).get(auth_1.default, list_scene_investigators_1.default).put(auth_1.default, update_scene_investigators_1.default);
routerv1.route("/expert").post(auth_1.default, create_expert_1.default).get(auth_1.default, list_expert_1.default).put(auth_1.default, update_expert_1.default);
routerv1.route("/adminById/:memId").get(auth_1.default, getbyid_admin_1.default);
routerv1.route("/commanderById/:memId").get(auth_1.default, getbyid_commander_1.default);
routerv1.route("/directorById/:memId").get(auth_1.default, getbyid_director_1.default);
routerv1.route("/sceneInvestigatorById/:memId").get(auth_1.default, getbyid_scene_investigators_1.default);
routerv1.route("/expertById/:memId").get(auth_1.default, getbyid_expert_1.default);
routerv1.route("/memberById/:memId").delete(auth_1.default, delete_member_1.default);
exports.default = routerv1;
