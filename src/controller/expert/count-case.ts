import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import assignModel from "../../models/assignModel";

const CountCaseExpert = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { expertId } = req.params;
    const rows = await assignModel.getCaseByExpertId(expertId);
    const countCaseAll = rows.length;

    const countCaseAssign = rows
      .map((rowCase: any) => {
        let check;
        rowCase.evidence_list.forEach((evidence: any) => {
          evidence.evidence_factor.forEach((factor: any) => {
            if (factor.assign_exp_status === "0") {
              check = true;
            }
          });
        });
        return check ? rowCase : null;
      })
      .filter((e: any) => e !== null)
      .flat().length;

    const countCaseClose = rows
      .map((rowCase: any) => {
        let check;
        rowCase.evidence_list.forEach((evidence: any) => {
          evidence.evidence_factor.forEach((factor: any) => {
            if (
              factor.assign_exp_status !== "0" &&
              factor.assign_exp_close_work === "1"
            ) {
              check = true;
            }
          });
        });
        return check ? rowCase : null;
      })
      .filter((e: any) => e !== null)
      .flat().length;

    const countCaseWork = rows
      .map((rowCase: any) => {
        let check;
        rowCase.evidence_list.forEach((evidence: any) => {
          evidence.evidence_factor.forEach((factor: any) => {
            if (
              factor.assign_exp_status !== "0" &&
              factor.assign_exp_close_work !== "1"
            ) {
              check = true;
            }
          });
        });
        return check ? rowCase : null;
      })
      .filter((e: any) => e !== null)
      .flat().length;

    console.log("countCaseAll", countCaseAll);
    console.log("countCaseAssign", countCaseAssign);
    console.log("countCaseClose", countCaseClose);
    console.log("countCaseWork", countCaseWork);

    res
      .status(200)
      .send({ countCaseAll, countCaseAssign, countCaseClose, countCaseWork });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CountCaseExpert;
