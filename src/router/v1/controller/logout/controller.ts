import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../../../db/mysql";
import ResponseError from "../../components/responseError";

const Logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies;
    if (!cookies.refresh) {
      return res.sendStatus(204); // No content
    }
    const refreshToken = cookies.refresh;

    // Check if refreshToken exists in the database
    const query = `SELECT * FROM RefreshToken WHERE refresh_token = ?`;
    mysqlDB.query(query, [refreshToken], async (err: any, result: any) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }

      if (result.length === 0) {
        // Clear the refresh token cookie
        res.clearCookie("refresh", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        return res.send("clearCookie");
      }

      const { mem_id } = result[0];

      // Delete refreshToken in the database
     const updateQuery = `UPDATE RefreshToken SET refresh_token = ? WHERE mem_id = ?`;
      mysqlDB.query(updateQuery, [null, mem_id], (err: any, result: any) => {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }

        // console.log(result);

        // Clear the refresh token cookie
        res.clearCookie("refresh", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });

        res.status(200).json({
          status: 200,
          code: "success",
          message: "success",
        });
      });
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default Logout;
