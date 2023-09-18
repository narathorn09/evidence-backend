import { Router } from "express";

import Auth from "../middleware/auth";
import HandleAccessToken from "../controller/accesstoken/controller";
import GetMe from "../controller/me/controller";
import Logout from "../controller/logout/controller";
import Login from "../controller/login/controller";
import GetIdByRoleAndMemId from "../controller/me/getId";
import UpdateProfile from "../controller/me/update-profile";
import UpdatePassword from "../controller/me/update-password";

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

//scene Investigator
import CreateTypeEvidence from "../controller/sceneInvestigator/create-typeEvidence";
import UpdateTypeEvidence from "../controller/sceneInvestigator/update-typeEvidence";
import ListTypeEvidence from "../controller/sceneInvestigator/list-typeEvidence";
import DeleteTypeEvidence from "../controller/sceneInvestigator/delete-typeEvidence";
import GetTypeEvidenceById from "../controller/sceneInvestigator/getbyid-typeEvidence";
import CreateCase from "../controller/sceneInvestigator/create-case";
import ListCaseById from "../controller/sceneInvestigator/listCaseById-case";
import GetCaseById from "../controller/sceneInvestigator/getbyid-case";
import UpdateCase from "../controller/sceneInvestigator/update-case";
import DeleteCase from "../controller/sceneInvestigator/delete-case";
import UpdateCaseStatus from "../controller/sceneInvestigator/update-case-status";

//director
import ListCaseAssign from "../controller/director/list-case-assign";
import AcceptCase from "../controller/director/accept-case";
import GetCaseAssignByCaseId from "../controller/director/getbyid-case-assign";
import CancelCase from "../controller/director/cancel-case";
import ListExpertByGroupId from "../controller/director/lise-expert";
import AssignEvidence from "../controller/director/assign-evidence";
import CountAssignEvidence from "../controller/director/count-assign-evidence";
import GetGroupByDirectorId from "../controller/director/getbyid-group";
import DirectorConfirmCase from "../controller/director/confirm-case";
import GetExpertDetailByExpertId from "../controller/director/getbyid-expert-detail";

//expert
import ListCaseByExpertId from "../controller/expert/list-case-assign";
import AcceptWork from "../controller/expert/accept-work";
import GetCaseByExpertIdAndCaseId from "../controller/expert/getbyid-case";
import saveResultEvidence from "../controller/expert/save-result-evidence";
import ExpertCloseWork from "../controller/expert/close-work";

//commander
import ListCaseAll from "../controller/commander/list-case-close";

const routerv1 = Router();

routerv1.route("/me").get(GetMe);
routerv1.route("/login").post(Login);
routerv1.route("/logout").get(Logout);
routerv1.route("/accesstoken").get(HandleAccessToken);
routerv1.route("/profile").put(Auth, UpdateProfile);
routerv1.route("/password").put(Auth, UpdatePassword);
routerv1.route("/id").post(Auth, GetIdByRoleAndMemId);

// admin
routerv1.route("/checkUsername").post(CheckUsername);
routerv1.route("/countMember").get(CountMember);
routerv1.route("/countGroup").get(CountGroup);
routerv1.route("/group").post(Auth,CreateGroup).get(Auth,ListGroup).put(Auth,UpdateGroup)
routerv1.route("/groupById/:groupId").get(Auth, GetGroupById).delete(Auth, DeleteGroup)
routerv1.route("/admin").post(Auth, CreateAdmin).get(Auth, ListAdmin).put(Auth,UpdateAdmin)
routerv1.route("/commander").post(Auth,CreateCommander).get(Auth,ListCommander).put(Auth,UpdateCommander)
routerv1.route("/director").post(Auth,CreateDirector).get(Auth,ListDirector).put(Auth,UpdateDirector)
routerv1.route("/sceneInvestigator").post(Auth,CreateSceneInvestigator).get(Auth,ListSceneInvestigator).put(Auth,UpdateSceneInvestigator)
routerv1.route("/expert").post(Auth,CreateExpert).get(Auth,ListExpert).put(Auth,UpdateExpert) //add in select expert when assign
routerv1.route("/adminById/:memId").get(Auth,GetAdminById);
routerv1.route("/commanderById/:memId").get(Auth,GetCommanderById);
routerv1.route("/directorById/:memId").get(Auth,GetDirectorById);
routerv1.route("/sceneInvestigatorById/:memId").get(Auth,GetSceneInvestigatorById);
routerv1.route("/expertById/:memId").get(Auth,GetExpertById);
routerv1.route("/memberById/:memId").delete(Auth, DeleteMember);

//scene Investigator
routerv1.route("/typeEvidence").post(Auth, CreateTypeEvidence).get(Auth, ListTypeEvidence).put(Auth, UpdateTypeEvidence)
routerv1.route("/typeEvidenceById/:typeEId").get(Auth, GetTypeEvidenceById).delete(Auth, DeleteTypeEvidence)
routerv1.route("/case").post(Auth, CreateCase).put(Auth, UpdateCase)
routerv1.route("/caseByInvesId/:invesId").get(Auth, ListCaseById)
routerv1.route("/caseByCaseId/:caseId").get(Auth, GetCaseById).delete(Auth, DeleteCase)
routerv1.route("/caseStatusByCaseId").put(Auth, UpdateCaseStatus)

//director
routerv1.route("/caseByAssign/:direcId").get(Auth, ListCaseAssign)
routerv1.route("/acceptCase").put(Auth, AcceptCase)
routerv1.route("/cancelCase").put(Auth, CancelCase)
routerv1.route("/caseAssignByCaseId").post(Auth, GetCaseAssignByCaseId)
routerv1.route("/expertByGroupId/:groupId").get(Auth, ListExpertByGroupId)
routerv1.route("/assignEvidence").post(Auth, AssignEvidence)
routerv1.route("/countAssignEvidence/:expertId").get(Auth, CountAssignEvidence)
routerv1.route("/groupByDirectorId/:directorId").get(Auth, GetGroupByDirectorId)
routerv1.route("/confirmCase").put(Auth, DirectorConfirmCase)
routerv1.route("/detailExpertById/:expertId").get(Auth, GetExpertDetailByExpertId)

//expert
routerv1.route("/caseByAssignByExpert/:expertId").get(Auth, ListCaseByExpertId)
routerv1.route("/acceptWork").put(Auth, AcceptWork)
routerv1.route("/caseAssignByExpertIdAndCaseId").post(Auth, GetCaseByExpertIdAndCaseId)
routerv1.route("/saveResultEvidence").post(Auth, saveResultEvidence)
routerv1.route("/expertCloseWork").post(Auth, ExpertCloseWork)

//commander
routerv1.route("/caseAll").get(Auth, ListCaseAll)

export default routerv1;
