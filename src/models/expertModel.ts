import { mysqlDB } from "../db/mysql";
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

interface ExpertData {
  nametitle: string;
  rank: string;
  fname: string;
  lname: string;
  username: string;
  password: string;
  groupid: number;
}

const expertModel: any = {};

expertModel.create = async (data: ExpertData): Promise<ExpertData | null> => {
  try {
    const { nametitle, rank, fname, lname, username, password, groupid } = data;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const connection = await mysqlDB.getConnection();

    try {
      await connection.beginTransaction();

      const memQuery =
        "INSERT INTO Member (mem_type, mem_username, mem_password) VALUES (?, ?, ?)";
      const memData = ["4", username, hash];
      const [resultMem] = await connection.query(memQuery, memData);

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
      const [result] = await connection.query(expertQuery, expertData);

      await connection.commit();
      connection.release();

      return result as ExpertData;
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw new Error("Error creating expert");
    }
  } catch (err) {
    throw new Error("Error creating expert");
  }
};

expertModel.getAll = async (): Promise<[]> => {
  const query = ` 
    SELECT
        m.mem_id, m.mem_type, m.mem_username,
        e.expert_id, e.expert_nametitle, e.expert_rank,
        e.expert_fname, e.expert_lname,
        e.group_id, g.group_name
    FROM
        Member m
    JOIN
        Expert e ON m.mem_id = e.mem_id
    LEFT JOIN
        GroupTable g ON g.group_id = e.group_id;
  `;
  const [rows] = await mysqlDB.query(query);
  return rows.length > 0 ? rows : [];
};

export default expertModel;
