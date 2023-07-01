import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import invesModel from "../../models/invesModel";

const CreateSceneInvestigator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nametitle, rank, fname, lname, username, password ,groupid}= req.body;
    const data = { nametitle, rank, fname, lname, username, password ,groupid};
    const response = await invesModel.create(data);
    if (!response) {
      res.status(500).json({
        status: "500",
        message: "Error creating scene investigator",
      });
      return;
    }
    res.status(200).json({
      status: "200",
      message: "Scene investigator created successfully",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CreateSceneInvestigator;
