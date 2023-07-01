import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import directorModel from "src/models/directorModel";

const UpdateDirector = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mem_id, nametitle, rank, fname, lname, username } = req.body;
    const data = { mem_id, nametitle, rank, fname, lname, username };
    const update = await directorModel.update(data);
    if (!update) {
      res.status(500).json({
        status: "500",
        message: "Error update director",
      });
      return;
    }
    res.status(200).json({
      status: "200",
      message: "Director update successfully",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default UpdateDirector;
