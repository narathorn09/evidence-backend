import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../../../db/mysql";
import ResponseError from "../../components/responseError";
import { jwtSign } from "../../../../../config/jwtSign";
const bcrypt = require("bcrypt");

const Login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies;
    // console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
    const { username, password } = req.body;

    const query = `SELECT * FROM Member WHERE mem_username = '${username}'`;
    mysqlDB.query(query, (err: any, resultMem: any) => {
      if (err) {
        console.log(err);
        return res.status(400).json({
          status: "400",
          message: "Error querying from db",
        });
      }
      if (resultMem.length === 0) {
        return res.status(401).send({ message: "Invalid username" });
      }
      const {
        mem_id,
        mem_type,
        mem_username,
        mem_password,
        refreshToken: reToken,
      } = resultMem[0];
      bcrypt.compare(password, mem_password, async (err: any, result: any) => {
        if (result) {
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
          //   let newRefreshTokenArray = !cookies?.refresh
          //     ? reToken
          //     : reToken.filter((rt: any) => rt !== cookies.refresh);
          let newRefreshTokenArray = [];

          if (Array.isArray(reToken)) {
            newRefreshTokenArray = !cookies?.refresh
              ? reToken
              : reToken.filter((rt: any) => rt !== cookies.refresh);
          } else {
            newRefreshTokenArray = [];
          }

          if (cookies?.refresh) {
            const refreshToken = cookies.refresh;
            const queryToken = `SELECT * FROM Member WHERE refreshToken = '${refreshToken}'`;
            mysqlDB.query(queryToken, async (err: any, resultToken: any) => {
              if (err) {
                console.log(err);
                return res.sendStatus(500);
              }
              if (resultToken.length === 0) {
                console.log("attempted refresh token reuse at login!");
                newRefreshTokenArray = [];
              }
              res.clearCookie("refresh", {
                httpOnly: true,
                sameSite: "none",
                secure: true,
              });
            });
          }

          const updateRefreshToken = [...newRefreshTokenArray, newRefreshToken];
          const updateQuery = `UPDATE Member SET refreshToken = '${JSON.stringify(
            updateRefreshToken
          )}' WHERE mem_id = '${mem_id}'`;
          mysqlDB.query(updateQuery, (err: any, result: any) => {
            if (err) {
              console.log(err);
              return res.sendStatus(500);
            }
            console.log(result);
            // ############################################  for https
            res.cookie("refresh", newRefreshToken, {
              httpOnly: true,
              secure: true,
              sameSite: "none",
              maxAge: 24 * 60 * 60 * 1000,
            });

            //    res.cookie("refresh", newRefreshToken, {
            //      httpOnly: false,
            //      secure: false,
            //      sameSite: "strict",
            //      maxAge: 24 * 60 * 60 * 1000,
            //      domain: "localhost",
            //      path: "/",
            //    });
              


            res.json({ mem_type, accessToken });
          });
        } else {
          return res.status(401).send("Invalid password");
        }
      });
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default Login;
