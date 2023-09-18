import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import caseModel from "../../models/caseModel";

const UpdateCase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      case_id,
      case_numboko,
      case_save_date,
      case_save_time,
      case_accident_date,
      case_accident_time,
      case_location,
      case_type,
      inves_id,
      defEvidence,
      removeEvidenceFactorInDef,
      newEvidence,
      removeEvidence,
    } = req.body;

    const data = {
      case_id,
      case_numboko,
      case_save_date,
      case_save_time,
      case_accident_date,
      case_accident_time,
      case_location,
      case_type,
      inves_id,
      defEvidence,
      removeEvidenceFactorInDef,
      newEvidence,
      removeEvidence,
    };

    const response = await caseModel.update(data);
    if (!response) {
      return res.status(500).json({
        status: "500",
        message: "Error Update Type Evidence",
      });
    }

    res.status(200).json({
      status: "200",
      message: "Case Updated Successfully",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default UpdateCase;
