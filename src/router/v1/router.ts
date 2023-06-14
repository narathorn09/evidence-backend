import { Router } from "express";

import DeleteMember from "./controller/admin/member-delete";
import CreateAdmin from "./controller/admin/admin-create";
import ListAdmin from "./controller/admin/admin-list";
import GetAdminById from "./controller/admin/admin-getbyid";

const routerv1 = Router();

routerv1.route("/admin").post(CreateAdmin).get(ListAdmin);
routerv1.route("/adminById").get(GetAdminById);
routerv1.route("/memberById/:memId").delete(DeleteMember);

export default routerv1;
