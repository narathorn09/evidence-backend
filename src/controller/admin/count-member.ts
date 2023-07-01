import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import countModel from "../../models/countModel";

const CountMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const count = await countModel.countAllUser();
    if (!count)
      return res.status(500).json({
        status: "500",
        message: "Error count user",
      });
    res.status(200).json(count);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CountMember;
