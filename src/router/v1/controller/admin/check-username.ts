import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../../../db/mysql";
import ResponseError from "../../components/responseError";

const CheckUsername = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username } = req.body;
    const query = `SELECT mem_username FROM Member WHERE mem_username = ?`;
    mysqlDB.query(query, [username], (err: any, result: any) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status: "500",
          message: "Error check username",
        });
      } else {
        res.send(result);
      }
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CheckUsername;
