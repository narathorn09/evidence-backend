import { mysqlDB } from "../db/mysql";
const bcrypt = require("bcrypt");

interface User {
  mem_id: number;
  mem_type: string;
  mem_username: string;
  mem_password: string;
}

const userModel: any = {};

userModel.getUserByUsername  = async (username: string): Promise<User | null> => {
  const [rows] = await mysqlDB.query("SELECT * FROM Member WHERE mem_username = ?", [
    username,
  ]);
  return rows.length > 0 ? rows[0] : null;
};

userModel.comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export default userModel;
