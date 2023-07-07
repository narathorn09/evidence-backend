import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import directorModel from "../../models/directorModel";

const CreateDirector = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nametitle, rank, fname, lname, username, password }= req.body;
    const data = { nametitle, rank, fname, lname, username, password };
    const response = await directorModel.create(data);
    if (!response) {
      res.status(500).json({
        status: "500",
        message: "Error creating director",
      });
      return;
    }
    res.status(200).json({
      status: "200",
      message: "Director created successfully",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CreateDirector;