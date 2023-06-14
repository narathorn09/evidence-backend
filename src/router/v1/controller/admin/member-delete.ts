import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../../../db/mysql";
import ResponseError from "../../components/responseError";

const DeleteMember = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { memId } = req.params;
    const query = `DELETE FROM Member WHERE mem_id=${memId}`;
    mysqlDB.query(query, (err: any, result: any) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: "500",
          message: "Error delete member",
        });
      } else {
        res.status(200).json({
          status: "200",
          message: "Delete member success",
        });
      }
    });
  } catch (err) {
    ResponseError(err, res)
  }
};

export default DeleteMember;
