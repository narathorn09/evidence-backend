import { Router } from "express";

import Auth from "./middleware/auth";
import DeleteMember from "./controller/admin/member-delete";
import CreateAdmin from "./controller/admin/admin-create";
import ListAdmin from "./controller/admin/admin-list";
import GetAdminById from "./controller/admin/admin-getbyid";
import Login from "./controller/login/controller";
import Logout from "./controller/logout/controller";
import HandleAccessToken from "./controller/accesstoken/controller";


const routerv1 = Router();
routerv1.route("/login").post(Login);
routerv1.route("/logout").get(Auth,Logout);
routerv1.route("/accesstoken").get(HandleAccessToken);
routerv1.route("/admin").post(CreateAdmin).get(ListAdmin);
routerv1.route("/adminById").get(GetAdminById);
routerv1.route("/memberById/:memId").delete(Auth,DeleteMember);

export default routerv1;
