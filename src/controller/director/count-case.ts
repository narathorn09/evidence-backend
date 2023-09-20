import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import assignModel from "../../models/assignModel";
import groupModel from "../../models/groupModel";
import expertModel from "../../models/expertModel";

const CountCaseDirector = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { directorId } = req.params;
    const data = { director_id: directorId };
    const rowCase = await assignModel.getCaseByAssignGroup(data);
    const group = await groupModel.getByDirectorId(directorId);
    const listExpert = await expertModel.getAllByGroupId(group?.[0]?.group_id);
    const countExpert = listExpert.length;

    const countCaseAll = rowCase?.length;

    const countCaseAssign = rowCase
      .map((rowCase: any) => {
        let check;
        rowCase.evidence_list.forEach((evidence: any) => {
          evidence.evidence_factor.forEach((factor: any) => {
            if (factor.assign_direc_status === "0") {
              check = true;
            }
          });
        });
        return check ? rowCase : null;
      })
      .filter((e: any) => e !== null)
      .flat().length;

    const countCaseAccept = rowCase
      .map((rowCase: any) => {
        let check;
        rowCase.evidence_list.forEach((evidence: any) => {
          evidence.evidence_factor.forEach((factor: any) => {
            if (
              factor.assign_direc_status === "1" &&
              factor.assign_exp_close_work === "0"
            ) {
              check = true;
            }
          });
        });
        return check ? rowCase : null;
      })
      .filter((e: any) => e !== null)
      .flat().length;

    const countCaseConfirm = rowCase
      .map((rowCase: any) => {
        let check;
        rowCase.evidence_list.forEach((evidence: any) => {
          evidence.evidence_factor.forEach((factor: any) => {
            if (
              factor.assign_direc_status === "1" &&
              factor.assign_exp_close_work === "1" &&
              factor.ef_status !== "3"
            ) {
              check = true;
            }
          });
        });
        return check ? rowCase : null;
      })
      .filter((e: any) => e !== null)
      .flat().length;

    const countCaseConfirmed = rowCase
      .map((rowCase: any) => {
        let check;
        rowCase.evidence_list.forEach((evidence: any) => {
          evidence.evidence_factor.forEach((factor: any) => {
            if (
              factor.assign_direc_status === "1" &&
              factor.assign_exp_close_work === "1" &&
              factor.ef_status === "3"
            ) {
              check = true;
            }
          });
        });
        return check ? rowCase : null;
      })
      .filter((e: any) => e !== null)
      .flat().length;
    
      
    // console.log("group", group);
    // console.log("countExpert", countExpert);
    // console.log("countCaseAll", countCaseAll);
    // console.log("countCaseAssign", countCaseAssign);
    // console.log("countCaseAccept", countCaseAccept);
    // console.log("countCaseConfirm", countCaseConfirm);


    res.status(200).send({countCaseAll, countCaseAssign, countCaseAccept, countCaseConfirm, countCaseConfirmed});
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CountCaseDirector;
