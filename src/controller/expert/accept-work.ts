import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import assignModel from "../../models/assignModel";

const AcceptWork = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { case_id, expert_id } = req.body;
    const data = { case_id, expert_id };
    const rows = await assignModel.expertAcceptWork(data);
    if (!rows) {
      return res.status(500).json({
        status: "500",
        message: "Error Accept Work",
      });
    }
    res.status(200).send(rows);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default AcceptWork;
