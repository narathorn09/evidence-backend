import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import typeEvidenceModel from "../../models/typeEvidenceModel";

const GetTypeEvidenceById = async (req: Request, res: Response, next: NextFunction) => {
  try {
   const { typeEId } = req.params;
   console.log("Request",req.params)
   const typeEvidence = await typeEvidenceModel.getById(typeEId)
      if (!typeEvidence) {
        return res.status(500).json({
          status: "500",
          message: "Error Get Type Evidence By Id",
        });
      } 
      res.send(typeEvidence);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default GetTypeEvidenceById;