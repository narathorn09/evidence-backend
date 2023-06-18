import { Request, Response, NextFunction } from "express";
import ResponseError from "../components/responseError";
const {
  jwt: { secret },
} = require("config");
const jwt = require("jsonwebtoken");

const Auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!`${authHeader}`?.startsWith("Bearer "))
      return res.status(401).json({
        status: 401,
        code: "Unauthorized",
        message: "Unauthorized",
      });
    const token = `${authHeader}`?.split(" ")[1];
    console.log("token in check", token, authHeader);
    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (err)
        return res.status(403).json({
          status: 403,
          code: "INVALID_TOKEN",
          message: "Invalid Token",
        }); //invalid token
      if (decoded) {
        console.log("decoded", decoded);
        next();
      }
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default Auth;
