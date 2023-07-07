import { mysqlDB } from "../db/mysql";
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

interface InvesData {
  mem_id: string;
  nametitle: string;
  rank: string;
  fname: string;
  lname: string;
  username: string;
  password: string;
  groupid: number;
}

const invesModel: any = {};

invesModel.create = async (data: InvesData): Promise<InvesData | null> => {
  try {
    const { nametitle, rank, fname, lname, username, password, groupid } = data;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const connection = await mysqlDB.getConnection();

    try {
      await connection.beginTransaction();

      const memQuery =
        "INSERT INTO Member (mem_type, mem_username, mem_password) VALUES (?, ?, ?)";
      const memData = ["2", username, hash];
      const [resultMem] = await connection.query(memQuery, memData);
      if (!resultMem) {
        await connection.rollback();
        connection.release();
        return null;
      }

      const invesQuery =
        "INSERT INTO Scene_investigators (inves_nametitle, inves_rank, inves_fname, inves_lname, mem_id, group_id) VALUES (?, ?, ?, ?, ?, ?)";
      const invesData = [
        nametitle,
        rank,
        fname,
        lname,
        resultMem.insertId,
        groupid,
      ];
      const [result] = await connection.query(invesQuery, invesData);
      if (!result) {
        await connection.rollback();
        connection.release();
        return null;
      }

      await connection.commit();
      connection.release();

      return result as InvesData;
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

invesModel.update = async (data: InvesData): Promise<InvesData | null> => {
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

      const invesQuery =
        "UPDATE Scene_investigators SET inves_nametitle = ?, inves_rank = ?, inves_fname = ?, inves_lname = ?, group_id = ? WHERE mem_id = ?";
      const invesData = [nametitle, rank, fname, lname, groupid, mem_id];

      const [result] = await connection.query(invesQuery, invesData);
      if (!result) {
        await connection.rollback();
        connection.release();
        return null;
      }

      await connection.commit();
      connection.release();

      return result as InvesData;
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

invesModel.getAll = async (): Promise<[] | null> => {
  const query = ` 
    SELECT
        Member.mem_id, Member.mem_type, Member.mem_username,
        Scene_investigators.inves_id, Scene_investigators.inves_nametitle, Scene_investigators.inves_rank,
        Scene_investigators.inves_fname, Scene_investigators.inves_lname,
        Scene_investigators.group_id, GroupTable.group_name
    FROM
        Member
    JOIN
        Scene_investigators ON Member.mem_id = Scene_investigators.mem_id
    LEFT JOIN
        GroupTable ON Scene_investigators.group_id = GroupTable.group_id;
  `;
  const [rows] = await mysqlDB.query(query);
  if (!rows) return null;
  return rows;
};

invesModel.getById = async (id: number): Promise<[] | null> => {
  const query = ` 
  SELECT
    Member.mem_id, Member.mem_type, Member.mem_username,
    Scene_investigators.inves_id, Scene_investigators.inves_nametitle, Scene_investigators.inves_rank,
    Scene_investigators.inves_fname, Scene_investigators.inves_lname,
    Scene_investigators.group_id, GroupTable.group_name
  FROM
    Member
  JOIN
    Scene_investigators ON Member.mem_id = Scene_investigators.mem_id
  LEFT JOIN
    GroupTable ON Scene_investigators.group_id = GroupTable.group_id
  WHERE Member.mem_id = ? AND Scene_investigators.mem_id = ?;
      `;
  const [rows] = await mysqlDB.query(query, [id, id]);
  if (!rows) return null;
  return rows;
};

export default invesModel;
