import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import groupModel from "../../models/groupModel";

const ListGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const group = await groupModel.getAll();
    if (!group) {
      return res.status(500).json({
        status: "500",
        message: "Error get all group",
      });
    }
    res.send(group);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ListGroup;
