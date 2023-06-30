import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../db/mysql";
import ResponseError from "../../components/responseError";
const bcrypt = require("bcrypt");

const CreateDirector = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { nametitle, rank, fname, lname, username, password} = req.body;
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
        const memData = ["3", username, hash];
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
          const directorQuery =
            "INSERT INTO Director (director_nametitle, director_rank, director_fname, director_lname, mem_id) VALUES (?, ?, ?, ?, ?)";
          const directorData = [
            nametitle,
            rank,
            fname,
            lname,
            resultMem.insertId,
          ];
          mysqlDB.query(
            directorQuery,
            directorData,
            (err: any, resultDir: any) => {
              if (err) {
                console.log(err);
                mysqlDB.rollback(() => {
                  res.status(500).json({
                    status: "500",
                    message: "Error creating director",
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
                    message: "Director created successfully",
                    result: resultDir,
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

export default CreateDirector;
