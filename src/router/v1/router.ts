import { Router } from "express";

import Auth from "./middleware/auth";
import GetMe from "./controller/me/controller";
import Login from "./controller/login/controller";
import Logout from "./controller/logout/controller";
import HandleAccessToken from "./controller/accesstoken/controller";

// admin
import CreateAdmin from "./controller/admin/create-admin";
import CreateCommander from "./controller/admin/create-commander";
import ListCommander from "./controller/admin/list-commander";
import ListAdmin from "./controller/admin/list-admin";
import GetAdminById from "./controller/admin/getbyid-admin";
import DeleteMember from "./controller/admin/delete-member";
import CheckUsername from "./controller/admin/check-username";


const routerv1 = Router();

routerv1.route("/me").get(GetMe);
routerv1.route("/login").post(Login);
routerv1.route("/logout").get(Auth, Logout);
routerv1.route("/accesstoken").get(HandleAccessToken);

routerv1.route("/checkUsername").post(CheckUsername);
routerv1.route("/admin").post(CreateAdmin).get(ListAdmin);
routerv1.route("/commander").post(CreateCommander).get(ListCommander);
routerv1.route("/adminById").get(GetAdminById);
routerv1.route("/memberById/:memId").delete(Auth, DeleteMember);

export default routerv1;
