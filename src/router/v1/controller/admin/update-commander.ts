import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../../../db/mysql";
import ResponseError from "../../components/responseError";

const UpdateCommander = async (
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
        const commanderQuery =
          "UPDATE Commander SET com_nametitle = ?, com_rank = ?, com_fname = ?, com_lname = ? WHERE mem_id = ? ";
        const commanderData = [nametitle, rank, fname, lname, mem_id];
        mysqlDB.query(
          commanderQuery,
          commanderData,
          (err: any, resultCom: any) => {
            if (err) {
              console.log(err);
              mysqlDB.rollback(() => {
                res.status(500).json({
                  status: "500",
                  message: "Error update commander",
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
                  message: "Commander update successfully",
                });
              }
            });
          }
        );
      });
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default UpdateCommander;
