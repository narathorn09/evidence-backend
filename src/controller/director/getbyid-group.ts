import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import groupModel from "../../models/groupModel";

const GetGroupByDirectorId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { directorId  } = req.params;
    const rows = await groupModel.getByDirectorId(directorId);
    if (!rows) {
      return res.status(500).json({
        status: "500",
        message: "Error Get Group By directorId",
      });
    }
    res.status(200).send(rows);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default GetGroupByDirectorId;
