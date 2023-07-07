import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import commanderModel from "../../models/commanderModel";

const CreateCommander = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nametitle, rank, fname, lname, username, password }= req.body;
    const data = { nametitle, rank, fname, lname, username, password };
    const response = await commanderModel.create(data);
    if (!response) {
      res.status(500).json({
        status: "500",
        message: "Error creating commander",
      });
      return;
    }
    res.status(200).json({
      status: "200",
      message: "Commander created successfully",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CreateCommander;