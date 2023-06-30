import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import userModel from "../../models/userModel";

const Logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies;
    if (!cookies.refresh) return res.sendStatus(204); // No content
    const refreshToken = cookies.refresh;
    const getLogout = await userModel.logout(refreshToken);
    if (getLogout) {
      res.clearCookie("refresh", {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      });
      return res.status(200).json({
        status: 200,
        code: "logout success",
        message: "logout success",
      });
    }
  } catch (err) {
    ResponseError(err, res);
  }
};

export default Logout;
