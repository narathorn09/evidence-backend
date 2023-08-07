import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import assignModel from "../../models/assignModel";

const ListCaseAssign = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { direcId } = req.params
    const data = { director_id: direcId}
    const rows = await assignModel.getCaseByAssignGroup(data);
    if (!rows) {
      return res.status(500).json({
        status: "500",
        message: "Error Get Case Assign",
      });
    }
    res.status(200).send(rows);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ListCaseAssign;