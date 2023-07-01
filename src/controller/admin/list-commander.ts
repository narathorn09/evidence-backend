import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import commanderModel from "../../models/commanderModel";

const ListCommander = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await commanderModel.getAll();
    res.send(response);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ListCommander;
