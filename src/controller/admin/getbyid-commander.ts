import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import commanderModel from "../../models/commanderModel";

const GetCommanderById = async (req: Request, res: Response, next: NextFunction) => {
  try {
   const { memId } = req.params;
   const commander = await commanderModel.getById(memId)
      if (!commander) {
        return res.status(500).json({
          status: "500",
          message: "Error get commander by Id",
        });
      } 
      res.send(commander);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default GetCommanderById;
