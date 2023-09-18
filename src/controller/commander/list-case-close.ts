import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import caseModel from "../../models/caseModel";

const ListCaseAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rows = await caseModel.getAllCase();
    if (!rows) {
      return res.status(500).json({
        status: "500",
        message: "Error Get Case List",
      });
    }
    res.status(200).send(rows);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ListCaseAll;
