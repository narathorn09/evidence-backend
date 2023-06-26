import { Router } from "express";

import Auth from "./middleware/auth";
import GetMe from "./controller/me/controller";
import Login from "./controller/login/controller";
import Logout from "./controller/logout/controller";
import HandleAccessToken from "./controller/accesstoken/controller";

// admin
import CreateAdmin from "./controller/admin/create-admin";
import CreateCommander from "./controller/admin/create-commander";
import CreateDirector from "./controller/admin/create-director";
import ListAdmin from "./controller/admin/list-admin";
import ListDirector from "./controller/admin/list-director";
import ListCommander from "./controller/admin/list-commander";
import GetAdminById from "./controller/admin/getbyid-admin";
import DeleteMember from "./controller/admin/delete-member";
import CheckUsername from "./controller/admin/check-username";
import ListGroup from "./controller/admin/list-group";
import CreateGroup from "./controller/admin/create-group";
import DeleteGroup from "./controller/admin/delete-group";

const routerv1 = Router();

routerv1.route("/me").get(GetMe);
routerv1.route("/login").post(Login);
routerv1.route("/logout").get(Auth, Logout);
routerv1.route("/accesstoken").get(HandleAccessToken);

routerv1.route("/checkUsername").post(CheckUsername);
routerv1.route("/group").post(Auth,CreateGroup).get(Auth,ListGroup)
routerv1.route("/groupById/:groupId").delete(Auth, DeleteGroup)
routerv1.route("/admin").post(Auth,CreateAdmin).get(Auth,ListAdmin);
routerv1.route("/commander").post(Auth,CreateCommander).get(Auth,ListCommander);
routerv1.route("/director").post(Auth,CreateDirector).get(Auth,ListDirector);
routerv1.route("/adminById").get(Auth,GetAdminById);
routerv1.route("/memberById/:memId").delete(Auth, DeleteMember);

export default routerv1;
