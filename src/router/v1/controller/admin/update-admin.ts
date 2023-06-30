import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../../../db/mysql";
import ResponseError from "../../components/responseError";

const UpdateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mem_id, admin_fname, admin_lname, username } = req.body;
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
        const adminQuery =
          "UPDATE Admin SET admin_fname = ?, admin_lname = ? WHERE mem_id = ? ";
        const adminData = [admin_fname, admin_lname, mem_id];
        mysqlDB.query(adminQuery, adminData, (err: any, resultAdmin: any) => {
          if (err) {
            console.log(err);
            mysqlDB.rollback(() => {
              res.status(500).json({
                status: "500",
                message: "Error update admin",
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
                message: "Admin update successfully",
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

export default UpdateAdmin;
