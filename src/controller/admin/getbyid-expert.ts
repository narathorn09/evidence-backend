import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import expertModel from "../../models/expertModel";

const GetExpertById = async (req: Request, res: Response, next: NextFunction) => {
  try {
   const { memId } = req.params;
   const expert = await expertModel.getById(memId)
      if (!expert) {
        return res.status(500).json({
          status: "500",
          message: "Error get expert by Id",
        });
      } 
      res.send(expert);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default GetExpertById;