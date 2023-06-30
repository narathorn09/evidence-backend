import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import { jwtSign } from "../../../config/jwtSign";
import userModel from "../../models/userModel";
import refreshTokenModel from "../../models/refreshTokenModel";

const Login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await userModel.getUserByUsername(username);
    if (!user) return res.status(401).send({ message: "Invalid username" });

    const { mem_id, mem_type, mem_username, mem_password } = user;
    const passwordMatch = await userModel.comparePassword(
      password,
      mem_password
    );

    if (passwordMatch) {
      const accessToken = await jwtSign(
        {
          id: mem_id,
          role: mem_type,
          username: mem_username,
        },
        "1m"
      );
      const newRefreshToken = await jwtSign(
        {
          id: mem_id,
          role: mem_type,
          username: mem_username,
        },
        "1d"
      );

      const foundRefresh = await refreshTokenModel.findTokenById(mem_id);
      if (foundRefresh)
        await refreshTokenModel.updateTokenById(mem_id, newRefreshToken);
      else await refreshTokenModel.createTokenById(mem_id, newRefreshToken);

      res.cookie("refresh", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ mem_type, accessToken });
    } else {
      return res.status(401).send("Invalid password");
    }
  } catch (err) {
    ResponseError(err, res);
  }
};

export default Login;
