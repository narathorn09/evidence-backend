import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import groupModel from "../../models/groupModel";

const DeleteGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { groupId } = req.params;
    const response = await groupModel.deleteGroupById(groupId);
    if (!response) {
      res.status(500).json({
        status: "500",
        message: "Error delete group",
      });
      return;
    }
    res.status(200).json({
      status: "200",
      message: "Delete group success",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default DeleteGroup;
