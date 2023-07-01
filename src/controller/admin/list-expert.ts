import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import expertModel from "../../models/expertModel";

const ListExpert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await expertModel.getAll();
    res.send(response);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ListExpert;
