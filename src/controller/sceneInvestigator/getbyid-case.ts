import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import caseModel from "../../models/caseModel";

const GetCaseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
   const { caseId } = req.params;
   const caseResult = await caseModel.getCaseById(caseId)
      if (!caseResult) {
        return res.status(500).json({
          status: "500",
          message: "Error Get Case By Id",
        });
      } 
      res.send(caseResult);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default GetCaseById;