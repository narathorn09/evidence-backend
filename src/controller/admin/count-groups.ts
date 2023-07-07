import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import countModel from "../../models/countModel";

const CountGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await countModel.countGroup();
    res.status(200).json(count);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CountGroup;
