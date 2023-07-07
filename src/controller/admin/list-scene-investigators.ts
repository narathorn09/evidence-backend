import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import invesModel from "../../models/invesModel";

const ListSceneInvestigator = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await invesModel.getAll();
    if (!response) {
      return res.status(500).json({
        status: "500",
        message: "Error get all scene investigator",
      });
    }
    res.send(response);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ListSceneInvestigator;
