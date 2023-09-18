import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import assignModel from "../../models/assignModel";

const AcceptCase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { case_id, director_id } = req.body;
    const data = { case_id, director_id };
    const rows = await assignModel.directorAcceptCaseAssign(data);
    if (!rows) {
      return res.status(500).json({
        status: "500",
        message: "Error Accept Case Assign",
      });
    }
    res.status(200).send(rows);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default AcceptCase;
