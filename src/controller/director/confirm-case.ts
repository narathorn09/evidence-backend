import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import assignModel from "../../models/assignModel";

const DirectorConfirmCase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { listIdEfConfirm } = req.body;
    const data = { listIdEfConfirm };
    const rows = await assignModel.directorConfirmCase(data);
    if (!rows) {
      return res.status(500).json({
        status: "500",
        message: "Error Confirm Case",
      });
    }
    res.status(200).send(rows);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default DirectorConfirmCase;
