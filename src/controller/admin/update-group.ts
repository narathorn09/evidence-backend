import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import groupModel from "../../models/groupModel";

const UpdateGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { group_id, group_name, group_status, director_id } = req.body;
    const data = { group_id, group_name, group_status, director_id };
    const response = await groupModel.update(data);
    if (!response) {
      return res.status(500).json({
        status: "500",
        message: "Error update group",
      });
    }
    res.status(200).json({
      status: "200",
      message: "Group update successfully",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default UpdateGroup;
