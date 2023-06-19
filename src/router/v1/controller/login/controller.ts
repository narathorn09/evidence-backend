import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../../../db/mysql";
import ResponseError from "../../components/responseError";
import { jwtSign } from "../../../../../config/jwtSign";
const bcrypt = require("bcrypt");

const Login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies;
    const { username, password } = req.body;

    const query = `SELECT * FROM Member WHERE mem_username = ?`;
    mysqlDB.query(query, [username], async (err: any, resultMem: any) => {
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
      const { mem_id, mem_type, mem_username, mem_password } = resultMem[0];
      try {
        const passwordMatch = await bcrypt.compareSync(password, mem_password);
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

          const findTokenQuery = `SELECT * FROM RefreshToken WHERE mem_id = ?`;
          mysqlDB.query(findTokenQuery, [mem_id], (err: any, result: any) => {
            if (err) {
              console.log(err);
              return res.status(500).json({
                status: "500",
                message: "Error querying RefreshToken from db",
              });
            }
            if (result.length > 0) {
              const updateQuery = `UPDATE RefreshToken SET refresh_token = ?, createdAt = CURRENT_TIMESTAMP(2) WHERE mem_id = ?`;
              mysqlDB.query(
                updateQuery,
                [newRefreshToken, mem_id],
                (err: any, result: any) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).json({
                      status: "500",
                      message: "Error updating RefreshToken in db",
                    });
                  }
                  console.log("UPDATE RefreshToken");
                }
              );
            } else {
              const insertTokenQuery =
                "INSERT INTO RefreshToken (mem_id, refresh_token, createdAt) VALUES (?, ?, CURRENT_TIMESTAMP(2))";
              mysqlDB.query(
                insertTokenQuery,
                [mem_id, newRefreshToken],
                (err: any, result: any) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).json({
                      status: "500",
                      message: "Error inserting RefreshToken into db",
                    });
                  }
                  console.log("INSERT RefreshToken");
                }
              );
            }
          });

          // Set refresh token as a secure HTTP-only cookie
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
        console.log(err);
        return res.status(500).json({
          status: "500",
          message: "Error comparing passwords",
        });
      }
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default Login;
