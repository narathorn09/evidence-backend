import { Request, Response, NextFunction } from "express";
import { mysqlDB } from "../../db/mysql";
import ResponseError from "../../components/responseError";

const CountMember = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const queryMem = `SELECT COUNT(mem_id) AS memCount FROM Member`;
    const queryAdmin = `SELECT COUNT(admin_id) AS adminCount FROM Admin`;
    const queryCom = `SELECT COUNT(com_id) AS comCount FROM Commander`;
    const queryDirec = `SELECT COUNT(director_id) AS directorCount FROM Director`;
    const queryInves = `SELECT COUNT(inves_id) AS invesCount FROM Scene_investigators`;
    const queryExpert = `SELECT COUNT(expert_id) AS expertCount FROM Expert`;

    const [memResult, adminResult, comResult, direcResult, invesResult, expertResult] = await Promise.all([
      mysqlDB.promise().query(queryMem),
      mysqlDB.promise().query(queryAdmin),
      mysqlDB.promise().query(queryCom),
      mysqlDB.promise().query(queryDirec),
      mysqlDB.promise().query(queryInves),
      mysqlDB.promise().query(queryExpert),
    ]);

    const countMem = memResult[0][0]?.memCount ?? 0;
    const countAdmin = adminResult[0][0]?.adminCount ?? 0;
    const countCom = comResult[0][0]?.comCount ?? 0;
    const countDirec = direcResult[0][0]?.directorCount ?? 0;
    const countInves = invesResult[0][0]?.invesCount ?? 0;
    const countExpert = expertResult[0][0]?.expertCount ?? 0;

    res.json({
      countMem,
      countAdmin,
      countCom,
      countDirec,
      countInves,
      countExpert,
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CountMember;
