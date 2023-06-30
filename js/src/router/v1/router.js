"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const controller_1 = __importDefault(require("../../controller/accesstoken/controller"));
const controller_2 = __importDefault(require("../../controller/me/controller"));
const controller_3 = __importDefault(require("../../controller/logout/controller"));
const controller_4 = __importDefault(require("../../controller/login/controller"));
// admin
const create_admin_1 = __importDefault(require("../../controller/admin/create-admin"));
// import CreateCommander from "./controller/admin/create-commander";
// import CreateDirector from "./controller/admin/create-director";
const list_admin_1 = __importDefault(require("../../controller/admin/list-admin"));
// import ListDirector from "./controller/admin/list-director";
// import ListCommander from "./controller/admin/list-commander";
// import GetAdminById from "./controller/admin/getbyid-admin";
// import DeleteMember from "./controller/admin/delete-member";
// import CheckUsername from "./controller/admin/check-username";
// import ListGroup from "./controller/admin/list-group";
// import CreateGroup from "./controller/admin/create-group";
// import DeleteGroup from "./controller/admin/delete-group";
// import CreateSceneInvestigator from "./controller/admin/create-scene-investigators";
// import ListSceneInvestigator from "./controller/admin/list-scene-investigators";
// import CreateExpert from "./controller/admin/create-expert";
// import ListExpert from "./controller/admin/list-expert";
// import CountMember from "./controller/admin/count-member";
// import CountGroup from "./controller/admin/count-groups";
// import UpdateAdmin from "./controller/admin/update-admin";
// import UpdateCommander from "./controller/admin/update-commander";
// import UpdateDirector from "./controller/admin/update-director";
const routerv1 = (0, express_1.Router)();
routerv1.route("/me").get(controller_2.default);
routerv1.route("/login").post(controller_4.default);
routerv1.route("/logout").get(auth_1.default, controller_3.default);
routerv1.route("/accesstoken").get(controller_1.default);
// routerv1.route("/checkUsername").post(CheckUsername);
// routerv1.route("/countMember").get(CountMember);
// routerv1.route("/countGroup").get(CountGroup);
// routerv1.route("/group").post(Auth,CreateGroup).get(Auth,ListGroup)
// routerv1.route("/groupById/:groupId").delete(Auth, DeleteGroup)
routerv1.route("/admin").post(auth_1.default, create_admin_1.default).get(auth_1.default, list_admin_1.default);
// routerv1.route("/commander").post(Auth,CreateCommander).get(Auth,ListCommander).put(UpdateCommander)
// routerv1.route("/director").post(Auth,CreateDirector).get(Auth,ListDirector).put(UpdateDirector)
// routerv1.route("/sceneInvestigator").post(Auth,CreateSceneInvestigator).get(Auth,ListSceneInvestigator)
// routerv1.route("/expert").post(Auth,CreateExpert).get(Auth,ListExpert)
// routerv1.route("/adminById").get(Auth,GetAdminById);
// routerv1.route("/memberById/:memId").delete(Auth, DeleteMember);
exports.default = routerv1;
