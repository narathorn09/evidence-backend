import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../../../db/mysql";
import ResponseError from "../../components/responseError";

const CreateGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { group_name, director_id } = req.body;
    const query = `INSERT INTO GroupTable (group_name, director_id) VALUES (?, ?)`;
    mysqlDB.query(query, [group_name, director_id], (err: any, result: any) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          status: "500",
          message: "Error creating group",
        });
      } else {
        res.status(200).json({
          status: "200",
          message: "Director created successfully",
          result: result,
        });
      }
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CreateGroup;
