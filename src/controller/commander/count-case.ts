import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import countModel from "../../models/countModel";

const CountCaseCommander = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const countCaseAll = await countModel.countCaseAll();
    const countCaseWork = await countModel.countCaseWork();
    const countCaseClose = await countModel.countCaseClose();
   
    res.status(200).send({countCaseAll, countCaseWork, countCaseClose});
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CountCaseCommander;
