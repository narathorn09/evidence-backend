import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../../../db/mysql";
import ResponseError from "../../components/responseError";
const bcrypt = require("bcrypt");

const CreateAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { admin_fname, admin_lname, username, password } = req.query;
    const SALT_ROUNDS = 10;
    bcrypt.hash(password, SALT_ROUNDS, (err: any, hash: any) => {
      if (err) {
        console.log(err);
        res.status(500).json({
          status: "500",
          message: "Error hashing password",
        });
        return;
      }
      mysqlDB.beginTransaction((err: any) => {
        if (err) {
          console.log(err);
          res.status(500).json({
            status: "500",
            message: "Error starting transaction",
          });
          return;
        }
        const memQuery =
          "INSERT INTO Member (mem_type, mem_username, mem_password) VALUES (?, ?, ?)";
        const memData = ["0", username, hash];
        mysqlDB.query(memQuery, memData, (err: any, resultMem: any) => {
          if (err) {
            console.log(err);
            mysqlDB.rollback(() => {
              res.status(500).json({
                status: "500",
                message: "Error creating member",
              });
              return;
            });
          }
          const adminQuery =
            "INSERT INTO Admin (admin_fname, admin_lname, mem_id) VALUES (?, ?, ?)";
          const adminData = [admin_fname, admin_lname, resultMem.insertId];
          mysqlDB.query(adminQuery, adminData, (err: any, resultAdmin: any) => {
            if (err) {
              console.log(err);
              mysqlDB.rollback(() => {
                res.status(500).json({
                  status: "500",
                  message: "Error creating admin",
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
                  message: "Admin created successfully",
                  result: resultAdmin,
                });
              }
            });
          });
        });
      });
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CreateAdmin;
