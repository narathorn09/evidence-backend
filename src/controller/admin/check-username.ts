import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import userModel from "../../models/userModel";

const CheckUsername = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.body;
    const response = await userModel.getUserByUsername(username);
    res.status(200).send(response ? ["username not available"] : []);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CheckUsername;
