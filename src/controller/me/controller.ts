import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import userModel from "../../models/userModel";
const {
  jwt: { secret },
} = require("config");
const jwt = require("jsonwebtoken");

const GetMe = async (req: Request, res: Response, next: NextFunction) => {

  const clearCook =()=> {
    return new Promise<void>((resolve, reject) => {
      res.clearCookie('refresh', {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      resolve();
    });
  }
  
  try {
    const cookies = req.cookies;
    if (!cookies?.refresh) return res.sendStatus(204); // No content
    const refreshToken = cookies.refresh;
    await jwt.verify(refreshToken, secret,async (err:any,decode:any)=>{
      if(err){clearCook(); return res.sendStatus(403);} // Invalid token
      const me = await userModel.getMe(decode);
      if (!me) {await clearCook(); return res.sendStatus(403);} // Invalid get me in db
      res.status(200).json(me);
    })
  
  } catch (e) {
    await clearCook();
    ResponseError(e, res);
  }
};

export default GetMe;
