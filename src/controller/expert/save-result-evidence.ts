import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import assignModel from "../../models/assignModel";

const saveResultEvidence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { resultEvidence } = req.body;
    const data = { resultEvidence };
    const rows = await assignModel.saveResultEvidence(data);
    if (!rows) {
      return res.status(500).json({
        status: "500",
        message: "Error Save Work",
      });
    }
    res.status(200).send(rows);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default saveResultEvidence;
