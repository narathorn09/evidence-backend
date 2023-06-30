import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import userModel from "../../models/userModel";

const GetMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refresh) return res.sendStatus(204); // No content
    const refreshToken = cookies.refresh;
    const me = await userModel.getMe(refreshToken);
    if (!me) {
      res.clearCookie("refresh", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.status(403).json({
        status: 403,
        code: "INVALID_TOKEN",
        message: "Invalid Token",
      });
    }

    res.status(200).json(me);
  } catch (e) {
    ResponseError(e, res);
  }
};

export default GetMe;
