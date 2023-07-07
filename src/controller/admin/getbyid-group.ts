import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import groupModel from "../../models/groupModel";

const GetGroupById = async (req: Request, res: Response, next: NextFunction) => {
  try {
   const { groupId } = req.params;
   const group = await groupModel.getById(groupId)
      if (!group) {
        return res.status(500).json({
          status: "500",
          message: "Error get group by Id",
        });
      } 
      res.send(group);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default GetGroupById;