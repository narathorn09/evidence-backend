import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import caseModel from "../../models/caseModel";

const ListCaseById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { invesId } = req.params
    const rows = await caseModel.getAllCaseByInvesId(invesId);
    if (!rows) {
      return res.status(500).json({
        status: "500",
        message: "Error Get All Case By Id",
      });
    }
    res.send(rows);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ListCaseById;