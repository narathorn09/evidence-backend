import { mysqlDB } from "../db/mysql";
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

interface CommanderData {
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

      const commanderQuery =
        "INSERT INTO Commander (com_nametitle, com_rank, com_fname,com_lname,mem_id) VALUES (?, ?, ?, ?, ?)";
      const CommanderData = [nametitle, rank, fname, lname, resultMem.insertId];
      const [result] = await connection.query(
        commanderQuery,
        CommanderData
      );

      await connection.commit();
      connection.release();

      return result as CommanderData;
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw new Error("Error creating commander");
    }
  } catch (err) {
    throw new Error("Error creating commander");
  }
};

commanderModel.getAll = async (): Promise<[]> => {
    const query = ` 
        SELECT 
        Member.mem_id, Member.mem_type, Member.mem_username,
        Commander.com_id, Commander.com_nametitle, Commander.com_rank, Commander.com_fname, Commander.com_lname
        FROM Member
        JOIN Commander ON Member.mem_id = Commander.mem_id
  `;
  const [rows] = await mysqlDB.query(query);
  return rows.length > 0 ? rows : [];
};

export default commanderModel;
