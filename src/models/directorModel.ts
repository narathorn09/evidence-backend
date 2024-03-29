import { mysqlDB } from "../db/mysql";
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

interface DirectorData {
  mem_id: number;
  nametitle: string;
  rank: string;
  fname: string;
  lname: string;
  username: string;
  password: string;
}

const directorModel: any = {};

directorModel.create = async (
  data: DirectorData
): Promise<DirectorData | null> => {
  try {
    const { nametitle, rank, fname, lname, username, password } = data;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const connection = await mysqlDB.getConnection();

    try {
      await connection.beginTransaction();

      const memQuery =
        "INSERT INTO Member (mem_type, mem_username, mem_password) VALUES (?, ?, ?)";
      const memData = ["3", username, hash];
      const [resultMem] = await connection.query(memQuery, memData);
      if (!resultMem) {
        await connection.rollback();
        connection.release();
        return null;
      }

      const directorQuery =
        "INSERT INTO Director (director_nametitle, director_rank, director_fname, director_lname, mem_id) VALUES (?, ?, ?, ?, ?)";
      const directorData = [nametitle, rank, fname, lname, resultMem.insertId];
      const [result] = await connection.query(directorQuery, directorData);
      if (!result) {
        await connection.rollback();
        connection.release();
        return null;
      }

      await connection.commit();
      connection.release();

      return result as DirectorData;
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

directorModel.update = async (
  data: DirectorData
): Promise<DirectorData | null> => {
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

      const directorQuery =
        "UPDATE Director SET director_nametitle = ?, director_rank = ?, director_fname = ?, director_lname = ? WHERE mem_id = ? ";
      const directorData = [nametitle, rank, fname, lname, mem_id];
      const [resultddirector] = await connection.query(
        directorQuery,
        directorData
      );
      if (!resultddirector) {
        await connection.rollback();
        connection.release();
        return null;
      }

      await connection.commit();
      connection.release();
      return resultddirector as DirectorData;
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

directorModel.getAll = async (): Promise<[] | null> => {
  const query = ` 
        SELECT
        Member.mem_id, Member.mem_type, Member.mem_username,
        Director.director_id, Director.director_nametitle, Director.director_rank, Director.director_fname, Director.director_lname
        FROM Member
        JOIN Director ON Member.mem_id = Director.mem_id
  `;
  const [rows] = await mysqlDB.query(query);
  if (!rows) return null;
  return rows;
};

directorModel.getById = async (id: number): Promise<[] | null> => {
  const query = ` 
        SELECT
        Member.mem_id, Member.mem_type, Member.mem_username,
        Director.director_id, Director.director_nametitle, Director.director_rank, Director.director_fname, Director.director_lname
        FROM Member
        JOIN Director ON Member.mem_id = Director.mem_id
        WHERE Member.mem_id = ? AND Director.mem_id = ?;
      `;
  const [rows] = await mysqlDB.query(query, [id, id]);
  if (!rows) return null;
  return rows;
};

export default directorModel;
