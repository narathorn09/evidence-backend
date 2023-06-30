import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import userModel from "../../models/userModel";

const DeleteMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { memId } = req.params;
    const response = await userModel.deleteUserById(memId);
    if (!response) {
      res.status(500).json({
        status: "500",
        message: "Error delete member",
      });
      return;
    }
    res.status(200).json({
      status: "200",
      message: "Delete member success",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default DeleteMember;
