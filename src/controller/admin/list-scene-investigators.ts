import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../db/mysql";
import ResponseError from "../../components/responseError";

const ListSceneInvestigator = (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = ` 
    SELECT
        Member.mem_id, Member.mem_type, Member.mem_username,
        Scene_investigators.inves_id, Scene_investigators.inves_nametitle, Scene_investigators.inves_rank,
        Scene_investigators.inves_fname, Scene_investigators.inves_lname,
        Scene_investigators.group_id, GroupTable.group_name
    FROM
        Member
    JOIN
        Scene_investigators ON Member.mem_id = Scene_investigators.mem_id
    LEFT JOIN
        GroupTable ON Scene_investigators.group_id = GroupTable.group_id;

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

export default ListSceneInvestigator;
