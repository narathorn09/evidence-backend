import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import { jwtSign } from "../../../config/jwtSign";
import refreshTokenModel from "../../models/refreshTokenModel";
import userModel from "../../models/userModel";

const {
  jwt: { secret },
} = require("config");
const jwt = require("jsonwebtoken");

const HandleAccessToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.refresh) {
      return res.status(401).json({
        status: 401,
        code: "Unauthorized",
        message: "Unauthorized",
      });
    }
    const refreshToken = cookies.refresh;
    const findUserByToken = await refreshTokenModel.findUserByToken(refreshToken);
    // console.log("findUserByToken",findUserByToken)

    if (!findUserByToken) {
      // const decoded = await jwt.verify(refreshToken, secret);
      // if (!decoded)
      //   return res.status(403).json({
      //     status: 403,
      //     code: "Forbidden",
      //     message: "Forbidden",
      //   });
      // const hackedUser = await userModel.getUserByUsername(decoded.username);
      // const { mem_id } = hackedUser;
      // await refreshTokenModel.updateTokenById(mem_id, null);
      // Remove the cookie by setting its expiration date to the past
      res.cookie('refresh', '', { expires: new Date(0) });

      return res.status(403).json({
        status: 403,
        code: "Forbidden",
        message: "Forbidden",
      });
    }

    const { mem_id } = findUserByToken;
    const decoded = await jwt.verify(refreshToken, secret);
    if (mem_id !== decoded.id) {
      return res.status(403).json({
        status: 403,
        code: "Forbidden",
        message: "Forbidden",
      });
    }

    const user = await userModel.getUserByUsername(decoded.username);
    // console.log("user",user);
    if (user) {
      const { mem_id, mem_type, mem_username } = user;
      const accessToken = await jwtSign(
        {
          id: mem_id,
          role: mem_type,
          username: mem_username,
        },
        "1m"
      );
      return res.status(200).json({ mem_type, accessToken });
    } else {

      return res.status(403).json({
        status: 403,
        code: "Not Found",
        message: "User not found in DB",
      });
    }
  } catch (err) {
    ResponseError(err, res);
  }
};

export default HandleAccessToken;
