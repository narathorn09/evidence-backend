import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../../../db/mysql";
import ResponseError from "../../components/responseError";
import { jwtSign } from "../../../../../config/jwtSign";

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

    const query = `SELECT * FROM Member WHERE JSON_CONTAINS(refreshToken, '"${refreshToken}"', '$')`;
    mysqlDB.query(query, async (err: any, resultMember: any) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }

      if (resultMember.length === 0) {
        jwt.verify(refreshToken, secret, async (err: any, decoded: any) => {
          if (err) {
            return res.status(403).json({
              status: 403,
              code: "Forbidden",
              message: "Forbidden",
            });
          }
          console.log("attempted refresh token reuse!");
          const hackedUserQuery = `SELECT * FROM Member WHERE mem_username = '${decoded.username}'`;
          mysqlDB.query(
            hackedUserQuery,
            async (err: any, resultHackedUser: any) => {
              if (err) {
                console.log(err);
                return res.sendStatus(500);
              }
              if (resultHackedUser.length > 0) {
                const hackedUser = resultHackedUser[0];
                hackedUser.refreshToken = [];
                const updateQuery = `UPDATE User SET refreshToken = '${JSON.stringify(
                  hackedUser.refreshToken
                )}' WHERE mem_id = '${hackedUser.mem_id}'`;
                mysqlDB.query(updateQuery, (err: any, result: any) => {
                  if (err) {
                    console.log(err);
                    return res.sendStatus(500);
                  }
                  console.log(result);
                });
              }
            }
          );
          return res.status(403).json({
            status: 403,
            code: "Forbidden",
            message: "Forbidden",
          });
        });
      }

      const foundMember = resultMember[0];
      const newRefreshTokenArray = foundMember.refreshToken.filter(
        (rt: any) => rt !== refreshToken
      );

      jwt.verify(refreshToken, secret, async (err: any, decoded: any) => {
        if (err) {
          console.log("expired refresh token");
          const updateQuery = `UPDATE User SET refreshToken = '${JSON.stringify(
            newRefreshTokenArray
          )}' WHERE mem_id = '${foundMember.mem_id}'`;
          mysqlDB.query(updateQuery, (err: any, result: any) => {
            if (err) {
              console.log(err);
              return res.sendStatus(500);
            }
            console.log(result);
          });
        }

        if (err || foundMember.mem_id !== decoded.id) {
          return res.status(403).json({
            status: 403,
            code: "Forbidden",
            message: "Forbidden",
          });
        }

        const accessToken = await jwtSign(
          {
            id: foundMember.mem_id,
            role: foundMember.mem_type,
            username: foundMember.mem_username,
          },
          "1m"
        );

        res.json({ mem_type: foundMember.mem_type, accessToken });
      });
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default HandleAccessToken;
