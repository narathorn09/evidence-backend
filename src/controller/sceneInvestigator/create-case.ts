import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import caseModel from "../../models/caseModel";

const CreateCase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      case_numboko,
      case_type,
      case_save_date,
      case_save_time,
      case_accident_date,
      case_accident_time,
      case_location,
      inves_id,
      evidence_list,
    } = req.body;

    const data = {
      case_numboko,
      case_type,
      case_save_date,
      case_save_time,
      case_accident_date,
      case_accident_time,
      case_location,
      inves_id,
      evidence_list,
    };

    const response = await caseModel.create(data);
    if (!response) {
      return res.status(500).json({
        status: "500",
        message: "Error Creating Type Evidence",
      });
    }

    res.status(200).json({
      status: "200",
      message: "Case Created Successfully",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CreateCase;
