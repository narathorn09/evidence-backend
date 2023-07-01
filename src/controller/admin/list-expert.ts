import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import expertModel from "../../models/expertModel";

const ListExpert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await expertModel.getAll();
    if (!response) {
      return res.status(500).json({
        status: "500",
        message: "Error get all expert",
      });
    }
    res.send(response);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ListExpert;
