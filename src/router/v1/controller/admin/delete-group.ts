import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../../../db/mysql";
import ResponseError from "../../components/responseError";

const DeleteGroup = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { groupId } = req.params;
    const query = `DELETE FROM GroupTable WHERE group_id=${groupId}`;
    mysqlDB.query(query, (err: any, result: any) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: "500",
          message: "Error delete group",
        });
      } else {
        res.status(200).json({
          status: "200",
          message: "Delete group success",
        });
      }
    });
  } catch (err) {
    ResponseError(err, res)
  }
};

export default DeleteGroup;
