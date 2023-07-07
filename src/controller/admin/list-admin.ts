import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import adminModel from "../../models/adminModel";

const ListAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await adminModel.getAll();
    if (!response) {
      return res.status(500).json({
        status: "500",
        message: "Error get all admin",
      });
    }
    res.send(response);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ListAdmin;
