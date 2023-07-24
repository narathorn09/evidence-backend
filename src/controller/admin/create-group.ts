import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import groupModel from "../../models/groupModel";

const CreateGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { group_name, group_status, director_id } = req.body;
    const data = { group_name, group_status, director_id };
    const response = await groupModel.create(data);
    if (!response) {
      return res.status(500).json({
        status: "500",
        message: "Error creating group",
      });
    }
    res.status(200).json({
      status: "200",
      message: "Group created successfully",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CreateGroup;
