import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import countModel from "../../models/countModel";

const CountCaseInves = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { invesId } = req.params
    const countCaseAll = await countModel.countCaseAllByInvesId(invesId);
    const countCaseWork = await countModel.countCaseByInvesId({invesId: invesId,caseStatus: "0"});
    const countCaseFinish = await countModel.countCaseByInvesId({invesId: invesId,caseStatus: "1"});
    const countCaseClose = await countModel.countCaseByInvesId({invesId: invesId,caseStatus: "2"});
   
    res.status(200).send({countCaseAll, countCaseWork, countCaseFinish, countCaseClose});
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CountCaseInves;
