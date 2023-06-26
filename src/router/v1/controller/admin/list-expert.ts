import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../../../db/mysql";
import ResponseError from "../../components/responseError";

const ListExpert = (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = ` 
    SELECT
        m.mem_id, m.mem_type, m.mem_username,
        e.expert_id, e.expert_nametitle, e.expert_rank,
        e.expert_fname, e.expert_lname,
        e.group_id, g.group_name
    FROM
        Member m
    JOIN
        Expert e ON m.mem_id = e.mem_id
    LEFT JOIN
        GroupTable g ON g.group_id = e.group_id;
      `;
    mysqlDB.query(query, (err: any, result: any) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status: "500",
          message: "Error get all scene investigator",
        });
      } else {
        res.send(result);
      }
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default ListExpert;
