import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import typeEvidenceModel from "../../models/typeEvidenceModel";

const UpdateTypeEvidence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type_e_id, type_e_name } = req.body;
    const data = { type_e_id, type_e_name};
    const response = await typeEvidenceModel.update(data);
    if (!response) {
      return res.status(500).json({
        status: "500",
        message: "Error Update Type Evidence",
      });
    }
    res.status(200).json({
      status: "200",
      message: "Type Evidence Update Successfully",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default UpdateTypeEvidence;
