import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import caseModel from "../../models/caseModel";

const UpdateCaseStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      case_id,
      case_status
    } = req.body;

    const data = {
        case_id,
        case_status
    };

    const response = await caseModel.updateCaseStatus(data);
    if (!response) {
      return res.status(500).json({
        status: "500",
        message: "Error Update Case Status",
      });
    }

    res.status(200).json({
      status: "200",
      message: "Case Status Updated Successfully",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default UpdateCaseStatus;
