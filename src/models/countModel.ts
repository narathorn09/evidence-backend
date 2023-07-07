import { mysqlDB } from "../db/mysql";

const countModel: any = {};

countModel.countAllUser = async (): Promise<any> => {
  const queryMem = `SELECT COUNT(mem_id) AS memCount FROM Member`;
  const queryAdmin = `SELECT COUNT(admin_id) AS adminCount FROM Admin`;
  const queryCom = `SELECT COUNT(com_id) AS comCount FROM Commander`;
  const queryDirec = `SELECT COUNT(director_id) AS directorCount FROM Director`;
  const queryInves = `SELECT COUNT(inves_id) AS invesCount FROM Scene_investigators`;
  const queryExpert = `SELECT COUNT(expert_id) AS expertCount FROM Expert`;

  const [
    memResult,
    adminResult,
    comResult,
    direcResult,
    invesResult,
    expertResult,
  ] = await Promise.all([
    mysqlDB.query(queryMem),
    mysqlDB.query(queryAdmin),
    mysqlDB.query(queryCom),
    mysqlDB.query(queryDirec),
    mysqlDB.query(queryInves),
    mysqlDB.query(queryExpert),
  ]);

  const countMem = memResult[0][0]?.memCount ?? 0;
  const countAdmin = adminResult[0][0]?.adminCount ?? 0;
  const countCom = comResult[0][0]?.comCount ?? 0;
  const countDirec = direcResult[0][0]?.directorCount ?? 0;
  const countInves = invesResult[0][0]?.invesCount ?? 0;
  const countExpert = expertResult[0][0]?.expertCount ?? 0;

  return {
    countMem,
    countAdmin,
    countCom,
    countDirec,
    countInves,
    countExpert,
  };
};

countModel.countGroup = async (): Promise<number> => {
    const queryGroup = `SELECT COUNT(group_id) AS groupCount FROM GroupTable`;
    const [result] = await mysqlDB.query(queryGroup);
    const count = result[0]?.groupCount ?? 0;
    return count;
};

export default countModel;
