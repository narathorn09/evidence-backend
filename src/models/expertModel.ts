import { mysqlDB } from "../db/mysql";
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

interface ExpertData {
  mem_id: number;
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
      if (!resultMem) {
        await connection.rollback();
        connection.release();
        return null;
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
      const [result] = await connection.query(expertQuery, expertData);
      if (!result) {
        await connection.rollback();
        connection.release();
        return null;
      }

      await connection.commit();
      connection.release();

      return result as ExpertData;
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

expertModel.update = async (data: ExpertData): Promise<ExpertData | null> => {
  try {
    const { mem_id, nametitle, rank, fname, lname, username, groupid } = data;
    const connection = await mysqlDB.getConnection();

    try {
      await connection.beginTransaction();

      const memQuery = "UPDATE Member SET mem_username = ? WHERE mem_id = ?";
      const memData = [username, mem_id];
      const [resultMem] = await connection.query(memQuery, memData);
      if (!resultMem) {
        await connection.rollback();
        connection.release();
        return null;
      }

      const expertQuery = "UPDATE Expert SET expert_nametitle = ?, expert_rank = ?, expert_fname = ?, expert_lname = ?, group_id = ? WHERE mem_id = ?";
      const expertData = [nametitle, rank, fname, lname, groupid, mem_id];
      const [result] = await connection.query(expertQuery, expertData);
      if (!result) {
        await connection.rollback();
        connection.release();
        return null;
      }

      await connection.commit();
      connection.release();

      return result as ExpertData;
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

expertModel.getAll = async (): Promise<[] | null> => {
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
  if(!rows) return null
  return rows;
};

expertModel.getAllByGroupId = async (groupId: number): Promise<[] | null> => {
  const query = ` 
    SELECT
        e.expert_id, e.expert_nametitle, e.expert_rank,
        e.expert_fname, e.expert_lname,
        e.group_id, g.group_name
    FROM
        Expert e 
    LEFT JOIN
        GroupTable g ON g.group_id = e.group_id
    WHERE e.group_id = ?;
  `;
  const [rows] = await mysqlDB.query(query, [groupId]);
  if(!rows) return null
  return rows;
};

expertModel.getById = async (id: number): Promise<[] | null> => {
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
    GroupTable g ON g.group_id = e.group_id
  WHERE m.mem_id = ? AND e.mem_id = ?;
      `;
  const [rows] = await mysqlDB.query(query, [id, id]);
  if (!rows) return null;
  return rows;
};

export default expertModel;
