import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../../../db/mysql";
import ResponseError from "../../components/responseError";
const {
  jwt: { secret },
} = require("config");
const jwt = require("jsonwebtoken");

const GetMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // On client, also delete the accessToken
    const cookies = req.cookies;
    // console.log("cookie", cookies);

    if (!cookies?.refresh) return res.sendStatus(204); // No content
    const refreshToken = cookies.refresh;
    jwt.verify(refreshToken, secret, async (err: any, decoded: any) => {
      if (err) {
        console.log("refreshToken in cookies: ",err.message);
        res.clearCookie("refresh", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });

        return res.status(403).json({
          status: 403,
          code: "INVALID_TOKEN",
          message: "Invalid Token",
        });
      }
      // console.log("decoded", decoded);
      let query = "";
      switch (decoded.role) {
        case "0": //admin
          query = `SELECT * FROM Member JOIN Admin ON Member.mem_id = Admin.mem_id  WHERE Member.mem_id = ${decoded.id} AND Admin.mem_id = ${decoded.id}`;
          break;
        case "1": //commander
          query = ` SELECT * FROM Member JOIN Commander ON Member.mem_id = Commander.mem_id WHERE Member.mem_id = ${decoded.id} AND Commander.mem_id = ${decoded.id}`;
          break;
        case "2": //Scene Investigator
          query = ` SELECT * FROM Member JOIN Scene_investigators ON Member.mem_id = Scene_investigators.mem_id WHERE Member.mem_id = ${decoded.id} AND Scene_investigators.mem_id = ${decoded.id}`;
          break;
        case "3": //Director
          query = ` SELECT * FROM Member JOIN Director ON Member.mem_id = Director.mem_id WHERE Member.mem_id = ${decoded.id} AND Director.mem_id = ${decoded.id}`;
          break;
        case "4": //Expert
          query = ` SELECT * FROM Member JOIN Expert ON Member.mem_id = Expert.mem_id WHERE Member.mem_id = ${decoded.id} AND Expert.mem_id = ${decoded.id}`;
          break;
        default:
          res.status(403).json({
            status: 403,
            code: "INVALID_ROLE",
            message: "Invalid Role",
          });
          break;
      }

      mysqlDB.query(query, async (error: any, results: any) => {
        if (error) {
          console.log("Error in fetching user from database: ", error);
          res.status(500).json({
            status: 500,
            code: "DATABASE_ERROR",
            message: "Error in fetching user from database",
          });
        } else {
          // console.log("found in me", results[0]);
          const member = results[0];
          res.status(200).json({
            id: member.mem_id,
            role: member.mem_type,
            username: member.mem_username,
            fname:
              member.admin_fname ||
              member.com_fname ||
              member.director_fname ||
              member.inves_fname ||
              member.expert_fname,
            lname:
              member.admin_lname ||
              member.com_lname ||
              member.director_lname ||
              member.inves_lname ||
              member.expert_lname,
            nametitle:
              member.com_nametitle ||
              member.director_nametitle ||
              member.inves_nametitle ||
              member.expert_nametitle,
            rank:
              member.com_rank ||
              member.director_rank ||
              member.inves_rank ||
              member.expert_rank,
          });
        }
      });
    });
  } catch (e) {
    ResponseError(e, res);
  }
};

export default GetMe;
