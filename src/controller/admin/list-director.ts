import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import directorModel from "../../models/directorModel";

const ListDirector = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await directorModel.getAll();
    res.send(response);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ListDirector;
