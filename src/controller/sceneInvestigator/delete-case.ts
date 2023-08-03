import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import caseModel from "../../models/caseModel";

const DeleteCase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { caseId } = req.params;
    const response = await caseModel.deleteById(caseId);
    if (!response) {
      res.status(500).json({
        status: "500",
        message: "Error Delete Case",
      });
      return;
    }
    res.status(200).json({
      status: "200",
      message: "Delete Case Success",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default DeleteCase;
