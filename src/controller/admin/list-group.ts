import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../db/mysql";
import ResponseError from "../../components/responseError";

const ListGroup = (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = ` 
    SELECT
      g.group_id, g.group_name,
      d.director_rank, d.director_fname, d.director_lname
    FROM
        GroupTable g
    LEFT JOIN
        Director d ON g.director_id = d.director_id;
      `;
    mysqlDB.query(query, (err: any, result: any) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status: "500",
          message: "Error get all group",
        });
      } else {
        res.send(result);
      }
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ListGroup;
