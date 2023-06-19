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

    const query = `SELECT * FROM RefreshToken WHERE refresh_token = ?`;
    mysqlDB.query(
      query,
      [refreshToken],
      async (err: any, resultMember: any) => {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }

        if (resultMember.length === 0) {
          try {
            const decoded = jwt.verify(refreshToken, secret);
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
                  const { mem_id, mem_type, mem_username, mem_password } =
                    resultHackedUser[0];
                  const updateQuery = `UPDATE RefreshToken SET refresh_token = ? WHERE mem_id = ?`;
                  mysqlDB.query(
                    updateQuery,
                    [null, mem_id],
                    (err: any, result: any) => {
                      if (err) {
                        console.log(err);
                        return res.sendStatus(500);
                      }
                      console.log(result);
                    }
                  );
                }
              }
            );
            return res.status(403).json({
              status: 403,
              code: "Forbidden",
              message: "Forbidden",
            });
          } catch (err) {
            return res.status(403).json({
              status: 403,
              code: "Forbidden",
              message: "Forbidden",
            });
          }
        }

        const { mem_id } = resultMember[0];

        try {
          const decoded = jwt.verify(refreshToken, secret);
          if (mem_id !== decoded.id) {
            return res.status(403).json({
              status: 403,
              code: "Forbidden",
              message: "Forbidden",
            });
          }

          const UserQuery = `SELECT * FROM Member WHERE mem_username = '${decoded.username}'`;
          mysqlDB.query(UserQuery, async (err: any, result: any) => {
            if (err) {
              console.log(err);
              return res.sendStatus(500);
            }
            if (result.length > 0) {
              const { mem_type, mem_username } = result[0];

              const accessToken = await jwtSign(
                {
                  id: mem_id,
                  role: mem_type,
                  username: mem_username,
                },
                "1m"
              );
              return res.json({ mem_type, accessToken });
            } else {
              return res.status(404).json({
                status: 404,
                code: "Not Found",
                message: "User not found",
              });
            }
          });
        } catch (err) {
          console.log("expired refresh token");
          const updateQuery = `UPDATE RefreshToken SET refresh_token = ? WHERE mem_id = ?`;
          mysqlDB.query(
            updateQuery,
            [null, mem_id],
            (err: any, result: any) => {
              if (err) {
                console.log(err);
                return res.sendStatus(500);
              }
              console.log("expired refresh token please login");
              return res.status(403).json({
                status: 403,
                code: "Forbidden",
                message: "Forbidden",
              });
            }
          );
        }
      }
    );
  } catch (err) {
    ResponseError(err, res);
  }
};

export default HandleAccessToken;
