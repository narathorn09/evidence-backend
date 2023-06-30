import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../db/mysql";
import ResponseError from "../../components/responseError";
const bcrypt = require("bcrypt");

const CreateExpert = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nametitle, rank, fname, lname, username, password, groupid} = req.body;
    const SALT_ROUNDS = 10;
    await bcrypt.hash(password, SALT_ROUNDS, (err: any, hash: any) => {
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
        const memData = ["4", username, hash];
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
          const expertQuery =
            "INSERT INTO Expert (expert_nametitle, expert_rank, expert_fname, expert_lname, mem_id, group_id) VALUES (?, ?, ?, ?, ?, ?)";
          const expertData = [
            nametitle,
            rank,
            fname,
            lname,
            resultMem.insertId,
            groupid,
          ];
          mysqlDB.query(
            expertQuery,
            expertData,
            (err: any, resultExpert: any) => {
              if (err) {
                console.log(err);
                mysqlDB.rollback(() => {
                  res.status(500).json({
                    status: "500",
                    message: "Error creating expert",
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
                    message: "Expert created successfully",
                    result: resultExpert,
                  });
                }
              });
            }
          );
        });
      });
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CreateExpert;
