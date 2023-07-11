import { mysqlDB } from "../db/mysql";

interface typeEvidenceData {
  type_e_id: number;
  type_e_name: string;
}

const typeEvidenceModel: any = {};

typeEvidenceModel.create = async (
  data: typeEvidenceData
): Promise<typeEvidenceData | null> => {
  try {
    const { type_e_name } = data;
    const connection = await mysqlDB.getConnection();
    const query = `INSERT INTO Type_Evidence (type_e_name) VALUES (?)`;
    const typeEvidenceData = [type_e_name];
    const [result] = await connection.query(query, typeEvidenceData);
    if (!result) {
      await connection.release();
      return null;
    }
    await connection.release();
    return result as typeEvidenceData;
  } catch (err) {
    throw err;
  }
};

typeEvidenceModel.update = async (
  data: typeEvidenceData
): Promise<typeEvidenceData | null> => {
  try {
    const { type_e_id, type_e_name } = data;
    const connection = await mysqlDB.getConnection();
    const query = `UPDATE Type_Evidence SET type_e_name = ? WHERE type_e_id = ?`;
    const typeEvidenceData = [type_e_name, type_e_id];
    const [result] = await connection.query(query, typeEvidenceData);
    if (!result) {
      await connection.release();
      return null;
    }
    await connection.release();
    return result as typeEvidenceData;
  } catch (err) {
    throw err;
  }
};

typeEvidenceModel.getAll = async (): Promise<[] | null> => {
  try {
    const connection = await mysqlDB.getConnection();
    const query = `SELECT * FROM Type_Evidence`;
    const [rows] = await connection.query(query);
    await connection.release();
    if (!rows) return null;
    return rows;
  } catch (err) {
    throw err;
  }
};

typeEvidenceModel.getById = async (type_e_id: number): Promise<[] | null> => {
  try {
    const connection = await mysqlDB.getConnection();
    const query = `SELECT * FROM Type_Evidence WHERE type_e_id=${type_e_id}`;
    const [rows] = await connection.query(query);
    await connection.release();
    return rows ? rows : null;
  } catch (err) {
    throw err;
  }
};

typeEvidenceModel.deleteById = async (type_e_id: number): Promise<boolean> => {
  try {
    const connection = await mysqlDB.getConnection();
    const query = `DELETE FROM Type_Evidence WHERE type_e_id=${type_e_id}`;
    const [result] = await connection.query(query);
    await connection.release();
    return result ? true : false;
  } catch (err) {
    throw err;
  }
};

export default typeEvidenceModel;
