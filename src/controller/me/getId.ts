import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import userModel from "../../models/userModel";

const GetIdByRoleAndMemId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, role } = req.body;
    const data = { id, role };
    const resultId = await userModel.getIdByRoleAndMemId(data);
    if (!resultId) {
      return res.status(500).json({
        status: "500",
        message: "Error Get Id",
      });
    }
    res.status(200).send(resultId);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default GetIdByRoleAndMemId;