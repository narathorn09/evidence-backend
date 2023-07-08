import { Router } from "express";

import Auth from "../middleware/auth";
import HandleAccessToken from "../controller/accesstoken/controller";
import GetMe from "../controller/me/controller";
import Logout from "../controller/logout/controller";
import Login from "../controller/login/controller";

// admin
import CreateAdmin from "../controller/admin/create-admin";
import CreateCommander from "../controller/admin/create-commander";
import CreateDirector from "../controller/admin/create-director";
import ListAdmin from "../controller/admin/list-admin";
import ListDirector from "../controller/admin/list-director";
import ListCommander from "../controller/admin/list-commander";
import DeleteMember from "../controller/admin/delete-member";
import CheckUsername from "../controller/admin/check-username";
import ListGroup from "../controller/admin/list-group";
import CreateGroup from "../controller/admin/create-group";
import DeleteGroup from "../controller/admin/delete-group";
import CreateSceneInvestigator from "../controller/admin/create-scene-investigators";
import ListSceneInvestigator from "../controller/admin/list-scene-investigators";
import CreateExpert from "../controller/admin/create-expert";
import ListExpert from "../controller/admin/list-expert";
import CountMember from "../controller/admin/count-member";
import CountGroup from "../controller/admin/count-groups";
import UpdateAdmin from "../controller/admin/update-admin";
import UpdateCommander from "../controller/admin/update-commander";
import UpdateDirector from "../controller/admin/update-director";
import GetAdminById from "../controller/admin/getbyid-admin";
import GetCommanderById from "../controller/admin/getbyid-commander";
import GetDirectorById from "../controller/admin/getbyid-director";
import GetSceneInvestigatorById from "../controller/admin/getbyid-scene-investigators";
import UpdateSceneInvestigator from "../controller/admin/update-scene-investigators";
import GetExpertById from "../controller/admin/getbyid-expert";
import UpdateExpert from "../controller/admin/update-expert";
import GetGroupById from "../controller/admin/getbyid-group";
import UpdateGroup from "../controller/admin/update-group";
import UpdateProfile from "../controller/me/update-profile";

const routerv1 = Router();

routerv1.route("/me").get(GetMe);
routerv1.route("/login").post(Login);
routerv1.route("/logout").get(Logout);
routerv1.route("/accesstoken").get(HandleAccessToken);
routerv1.route("/profile").put(Auth, UpdateProfile);
// admin
routerv1.route("/checkUsername").post(CheckUsername);
routerv1.route("/countMember").get(CountMember);
routerv1.route("/countGroup").get(CountGroup);
routerv1.route("/group").post(Auth,CreateGroup).get(Auth,ListGroup).put(Auth,UpdateGroup)
routerv1.route("/groupById/:groupId").get(Auth, GetGroupById).delete(Auth, DeleteGroup)
routerv1.route("/admin").post(CreateAdmin).get(Auth,ListAdmin).put(Auth,UpdateAdmin)
routerv1.route("/commander").post(Auth,CreateCommander).get(Auth,ListCommander).put(Auth,UpdateCommander)
routerv1.route("/director").post(Auth,CreateDirector).get(Auth,ListDirector).put(Auth,UpdateDirector)
routerv1.route("/sceneInvestigator").post(Auth,CreateSceneInvestigator).get(Auth,ListSceneInvestigator).put(Auth,UpdateSceneInvestigator)
routerv1.route("/expert").post(Auth,CreateExpert).get(Auth,ListExpert).put(Auth,UpdateExpert)
routerv1.route("/adminById/:memId").get(Auth,GetAdminById);
routerv1.route("/commanderById/:memId").get(Auth,GetCommanderById);
routerv1.route("/directorById/:memId").get(Auth,GetDirectorById);
routerv1.route("/sceneInvestigatorById/:memId").get(Auth,GetSceneInvestigatorById);
routerv1.route("/expertById/:memId").get(Auth,GetExpertById);
routerv1.route("/memberById/:memId").delete(Auth, DeleteMember);

export default routerv1;
