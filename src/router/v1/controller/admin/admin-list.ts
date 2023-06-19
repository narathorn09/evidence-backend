import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../../../db/mysql";
import ResponseError from "../../components/responseError";

const ListAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = ` 
        SELECT *
        FROM Member
        JOIN Admin ON Member.mem_id = Admin.mem_id
      `;
    mysqlDB.query(query, (err: any, result: any) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status: "500",
          message: "Error get all admin",
        });
      } else {
        res.send(result);
      }
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ListAdmin;
