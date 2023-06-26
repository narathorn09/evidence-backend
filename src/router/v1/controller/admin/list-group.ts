import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../../../db/mysql";
import ResponseError from "../../components/responseError";

const ListGroup = (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = ` 
        SELECT
        GroupTable.group_id, GroupTable.group_name,
        Director.director_rank, Director.director_fname, Director.director_lname
        FROM GroupTable
        JOIN Director ON GroupTable.director_id = Director.director_id
      `;
    mysqlDB.query(query, (err: any, resulthavedirec: any) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status: "500",
          message: "Error get all group",
        });
      } else {
        const query = `SELECT * FROM GroupTable WHERE director_id IS NULL`;
        mysqlDB.query(query, (err: any, result: any) => {
          if (err) {
            console.log(err);
            return res.status(500).json({
              status: "500",
              message: "Error get all group without director",
            });
          }
          res.send([...resulthavedirec, ...result]);
        });
      }
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ListGroup;
