import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import expertModel from "../../models/expertModel";


const UpdateExpert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mem_id, nametitle, rank, fname, lname, username, groupid} = req.body;
    const data = { mem_id, nametitle, rank, fname, lname, username, groupid};
    const update = await expertModel.update(data);
    if (!update) {
      res.status(500).json({
        status: "500",
        message: "Error update expert",
      });
      return;
    }
    res.status(200).json({
      status: "200",
      message: "Expert update successfully",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default UpdateExpert;