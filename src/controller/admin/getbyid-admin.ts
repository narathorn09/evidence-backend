import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../db/mysql";
import ResponseError from "../../components/responseError";

const GetAdminById = (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = `
        SELECT *
        FROM Member
        JOIN Admin ON Member.mem_id = Admin.mem_id
        WHERE Member.mem_id = 4 AND Admin.mem_id = 4`;
        
    mysqlDB.query(query, (err: any, result: any) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: "500",
          message: "Error get admin by Id",
        });
      } else {
        res.send({ ...result[0] });
      }
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default GetAdminById;
