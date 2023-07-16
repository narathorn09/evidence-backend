import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import typeEvidenceModel from "../../models/typeEvidenceModel";

const CreateTypeEvidence = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type_e_name } = req.body;
    const data = { type_e_name };
    const response = await typeEvidenceModel.create(data);
    if (!response) {
      return res.status(500).json({
        status: "500",
        message: "Error Creating Type Evidence",
      });
    }
    res.status(200).json({
      status: "200",
      message: "Type Evidence Created successfully",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CreateTypeEvidence;