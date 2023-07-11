import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import typeEvidenceModel from "../../models/typeEvidenceModel";

const DeleteTypeEvidence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { typeEId } = req.params;
    const response = await typeEvidenceModel.deleteById(typeEId);
    if (!response) {
      res.status(500).json({
        status: "500",
        message: "Error Delete Type Evidence",
      });
      return;
    }
    res.status(200).json({
      status: "200",
      message: "Delete Type Evidence Success",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default DeleteTypeEvidence;
