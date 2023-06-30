import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../db/mysql";
import ResponseError from "../../components/responseError";

const CountGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryGroup = `SELECT COUNT(group_id) AS groupCount FROM GroupTable`;

    const [result] = await mysqlDB.promise().query(queryGroup);

    const countG = result[0]?.groupCount ?? 0;

    res.json(countG);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CountGroup;
