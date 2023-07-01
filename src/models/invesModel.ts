import { mysqlDB } from "../db/mysql";
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

interface InvesData {
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

      await connection.commit();
      connection.release();

      return result as InvesData;
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw new Error("Error creating investigator");
    }
  } catch (err) {
    throw new Error("Error creating investigator");
  }
};

invesModel.getAll = async (): Promise<[]> => {
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
  return rows.length > 0 ? rows : [];
};

export default invesModel;
