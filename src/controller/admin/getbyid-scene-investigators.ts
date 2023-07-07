import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import invesModel from "../../models/invesModel";

const GetSceneInvestigatorById = async (req: Request, res: Response, next: NextFunction) => {
  try {
   const { memId } = req.params;
   const inves = await invesModel.getById(memId)
      if (!inves) {
        return res.status(500).json({
          status: "500",
          message: "Error get inves by Id",
        });
      } 
      res.send(inves);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default GetSceneInvestigatorById;