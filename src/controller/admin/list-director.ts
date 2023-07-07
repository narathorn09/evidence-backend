import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import directorModel from "../../models/directorModel";

const ListDirector = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await directorModel.getAll();
    if (!response) {
      return res.status(500).json({
        status: "500",
        message: "Error get all director",
      });
    }
    res.send(response);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ListDirector;
