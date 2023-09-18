import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import assignModel from "../../models/assignModel";

const ListCaseByExpertId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { expertId  } = req.params;
    const rows = await assignModel.getCaseByExpertId(expertId);
    if (!rows) {
      return res.status(500).json({
        status: "500",
        message: "Error Get Case Assign By ExpertId",
      });
    }
    res.status(200).send(rows);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ListCaseByExpertId;
