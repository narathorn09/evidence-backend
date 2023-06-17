import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../../../db/mysql";
import ResponseError from "../../components/responseError";

const Logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies;
    console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
    if (!cookies.refresh) return res.sendStatus(204); // No content
    const refreshToken = cookies.refresh;

    // Check if refreshToken exists in the database
    const query = `SELECT * FROM Member WHERE JSON_EXTRACT(refreshToken, '$.refreshToken') = ?`;
    mysqlDB.query(query, [refreshToken], async (err: any, result: any) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }

      if (result.length === 0) {
        res.clearCookie("refresh", {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        });
        return res.send("clearCookie");
      }

      // Delete refreshToken in the database
      const updateQuery = `UPDATE Member SET refreshToken = JSON_REMOVE(refreshToken, JSON_UNQUOTE(JSON_SEARCH(refreshToken, 'one', ?)))`;
      mysqlDB.query(updateQuery, [refreshToken], (err: any, result: any) => {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }

        console.log(result);

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
  } catch (e) {
    ResponseError(e, res);
  }
};

export default Logout;
