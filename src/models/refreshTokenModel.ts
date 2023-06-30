import { mysqlDB } from "../db/mysql";

const refreshTokenModel: any = {};

refreshTokenModel.findTokenById = async (mem_id: number): Promise<boolean> => {
  const [rows] = await mysqlDB.query(
    "SELECT * FROM RefreshToken WHERE mem_id = ?",
    [mem_id]
  );
  return rows.length > 0 ? true : false;
};

refreshTokenModel.createTokenById = async (
  mem_id: number,
  newRefreshToken: string
): Promise<boolean> => {
  try {
    const [rows] = await mysqlDB.query(
      "INSERT INTO RefreshToken (mem_id, refresh_token, createdAt) VALUES (?, ?, CURRENT_TIMESTAMP(2))",
      [mem_id, newRefreshToken]
    );
    return rows ? true : false;
  } catch (error) {
    console.error("Error create refresh token:", error);
    return false;
  }
};

refreshTokenModel.updateTokenById = async (
  mem_id: number,
  newRefreshToken: string
): Promise<boolean> => {
  try {
    const [rows] = await mysqlDB.query(
      "UPDATE RefreshToken SET refresh_token = ?, createdAt = CURRENT_TIMESTAMP(2) WHERE mem_id = ?",
      [newRefreshToken, mem_id]
    );
    return rows.affectedRows > 0;
  } catch (error) {
    console.error("Error updating refresh token:", error);
    return false;
  }
};

refreshTokenModel.findTokenByToken = async (
  newRefreshToken: string
): Promise<boolean> => {
  const [rows] = await mysqlDB.query(
    "SELECT * FROM RefreshToken WHERE refresh_token = ?",
    [newRefreshToken]
  );
  return rows.length > 0;
};

export default refreshTokenModel;
