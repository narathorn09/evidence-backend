import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import typeEvidenceModel from "../../models/typeEvidenceModel";

const ListTypeEvidence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await typeEvidenceModel.getAll();
    if (!rows) {
      return res.status(500).json({
        status: "500",
        message: "Error Get All Type Evidence",
      });
    }
    res.send(rows);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ListTypeEvidence;