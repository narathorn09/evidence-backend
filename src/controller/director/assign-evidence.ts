import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import assignModel from "../../models/assignModel";

const AssignEvidence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { dataForAssign } = req.body;
    const data = { dataForAssign };
    const rows = await assignModel.directorAssignEvidence(data);
    if (!rows) {
      return res.status(500).json({
        status: "500",
        message: "Error Assign Evidence",
      });
    }
    res.status(200).send(rows);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default AssignEvidence;
