import { mysqlDB } from "../db/mysql";
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

interface CommanderData {
  mem_id: number;
  nametitle: string;
  rank: string;
  fname: string;
  lname: string;
  username: string;
  password: string;
}

const commanderModel: any = {};

commanderModel.create = async (
  data: CommanderData
): Promise<CommanderData | null> => {
  try {
    const { nametitle, rank, fname, lname, username, password } = data;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const connection = await mysqlDB.getConnection();

    try {
      await connection.beginTransaction();

      const memQuery =
        "INSERT INTO Member (mem_type, mem_username, mem_password) VALUES (?, ?, ?)";
      const memData = ["1", username, hash];
      const [resultMem] = await connection.query(memQuery, memData);
      if (!resultMem) {
        await connection.rollback();
        connection.release();
        return null;
      }

      const commanderQuery =
        "INSERT INTO Commander (com_nametitle, com_rank, com_fname,com_lname,mem_id) VALUES (?, ?, ?, ?, ?)";
      const CommanderData = [nametitle, rank, fname, lname, resultMem.insertId];
      const [result] = await connection.query(commanderQuery, CommanderData);
      if (!result) {
        await connection.rollback();
        connection.release();
        return null;
      }

      await connection.commit();
      connection.release();
      return result as CommanderData;
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

commanderModel.update = async (
  data: CommanderData
): Promise<CommanderData | null> => {
  try {
    const { mem_id, nametitle, rank, fname, lname, username } = data;
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

      const commanderQuery =
        "UPDATE Commander SET com_nametitle = ?, com_rank = ?, com_fname = ?, com_lname = ? WHERE mem_id = ? ";
      const commanderData = [nametitle, rank, fname, lname, mem_id];
      const [resultCom] = await connection.query(
        commanderQuery,
        commanderData
      );
      if (!resultCom) {
        await connection.rollback();
        connection.release();
        return null;
      }

      await connection.commit();
      connection.release();
      return resultCom as CommanderData;
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

commanderModel.getAll = async (): Promise<[] | null> => {
  const query = ` 
        SELECT 
        Member.mem_id, Member.mem_type, Member.mem_username,
        Commander.com_id, Commander.com_nametitle, Commander.com_rank, Commander.com_fname, Commander.com_lname
        FROM Member
        JOIN Commander ON Member.mem_id = Commander.mem_id
  `;
  const [rows] = await mysqlDB.query(query);
  if (!rows) return null;
  return rows;
};

export default commanderModel;
