import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import directorModel from "../../models/directorModel";

const GetDirectorById = async (req: Request, res: Response, next: NextFunction) => {
  try {
   const { memId } = req.params;
   const director = await directorModel.getById(memId)
      if (!director) {
        return res.status(500).json({
          status: "500",
          message: "Error get director by Id",
        });
      } 
      res.send(director);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default GetDirectorById;
