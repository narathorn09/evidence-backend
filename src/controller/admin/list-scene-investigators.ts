import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import invesModel from "../../models/invesModel";

const ListSceneInvestigator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await invesModel.getAll();
    res.send(response);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ListSceneInvestigator;
