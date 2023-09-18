import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import assignModel from "../../models/assignModel";

const GetCaseAssignByCaseId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { director_id , case_id } = req.body;
    const data = { director_id , case_id};
    const rows = await assignModel.getCaseAssignByCaseId(data);
    if (!rows) {
      return res.status(500).json({
        status: "500",
        message: "Error Get Case Assign By CaseId",
      });
    }
    res.status(200).send(rows);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default GetCaseAssignByCaseId;
