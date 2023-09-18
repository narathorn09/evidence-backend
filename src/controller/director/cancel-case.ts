import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import assignModel from "../../models/assignModel";

const CancelCase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { case_id, director_id } = req.body;
    const data = { case_id, director_id };
    const rows = await assignModel.directorCancelCaseAssign(data);
    if (!rows) {
      return res.status(500).json({
        status: "500",
        message: "Error Cancel Case Assign",
      });
    }
    res.status(200).send(rows);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CancelCase;
