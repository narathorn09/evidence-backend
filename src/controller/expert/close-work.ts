import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import assignModel from "../../models/assignModel";

const ExpertCloseWork = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { listClose, case_id, case_summary_text } = req.body;
    const data = { listClose, case_id, case_summary_text };
    const rows = await assignModel.expertCloseWork(data);
    if (!rows) {
      return res.status(500).json({
        status: "500",
        message: "Error Close Work",
      });
    }
    res.status(200).send(rows);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ExpertCloseWork;
