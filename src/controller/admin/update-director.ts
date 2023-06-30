import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../db/mysql";
import ResponseError from "../../components/responseError";

const UpdateDirector = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { mem_id, nametitle, rank, fname, lname, username } = req.body;
    mysqlDB.beginTransaction((err: any) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: "500",
          message: "Error starting transaction",
        });
        return;
      }
      const memQuery = "UPDATE Member SET mem_username = ? WHERE mem_id = ?";
      const memData = [username, mem_id];
      mysqlDB.query(memQuery, memData, (err: any, resultMem: any) => {
        if (err) {
          console.log(err);
          mysqlDB.rollback(() => {
            res.status(500).json({
              status: "500",
              message: "Error update member",
            });
            return;
          });
        }
        const directorQuery =
          "UPDATE Director SET director_nametitle = ?, director_rank = ?, director_fname = ?, director_lname = ? WHERE mem_id = ? ";
        const directorData = [nametitle, rank, fname, lname, mem_id];
        mysqlDB.query(directorQuery, directorData, (err: any, result: any) => {
          if (err) {
            console.log(err);
            mysqlDB.rollback(() => {
              res.status(500).json({
                status: "500",
                message: "Error update director",
              });
              return;
            });
          }
          mysqlDB.commit((err: any) => {
            if (err) {
              console.log(err);
              mysqlDB.rollback(() => {
                res.status(500).json({
                  status: "500",
                  message: "Error committing transaction",
                });
                return;
              });
            } else {
              res.status(200).json({
                status: "200",
                message: "Director update successfully",
              });
            }
          });
        });
      });
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default UpdateDirector;
