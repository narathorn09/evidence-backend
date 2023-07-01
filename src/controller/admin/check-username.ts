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
    if (!response) return res.status(200).send([]);
    res.status(200).send(response.mem_username);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CheckUsername;
