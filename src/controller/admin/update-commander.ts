import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import commanderModel from "../../models/commanderModel";

const UpdateCommander = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mem_id, nametitle, rank, fname, lname, username } = req.body;
    const data = { mem_id, nametitle, rank, fname, lname, username };
    const update = await commanderModel.update(data);
    if (!update) {
      res.status(500).json({
        status: "500",
        message: "Error update commander",
      });
      return;
    }
    res.status(200).json({
      status: "200",
      message: "Commander update successfully",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default UpdateCommander;
