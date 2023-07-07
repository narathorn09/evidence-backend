import { mysqlDB } from "../db/mysql";
const bcrypt = require("bcrypt");

interface User {
  mem_id: number;
  mem_type: string;
  mem_username: string;
  mem_password: string;
}

interface Me {
  id: number;
  role: string;
  username: string;
  fname: string;
  lname: string;
  nametitle: string;
  rank: string;
}

const userModel: any = {};

userModel.getUserByUsername = async (
  username: string
): Promise<User | null> => {
  const [rows] = await mysqlDB.query(
    "SELECT * FROM Member WHERE mem_username = ?",
    [username]
  );
  return rows.length > 0 ? rows[0] : null;
};

userModel.deleteUserById = async (memId: number): Promise<boolean> => {
  const query = `DELETE FROM Member WHERE mem_id=${memId}`;
  const [rows] = await mysqlDB.query(query);
  return rows ? true : false;
};

userModel.comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

userModel.getMe = async (decode: any): Promise<Me | null> => {
  let query = "";
  switch (decode.role) {
    case "0": //admin
      query = `SELECT * FROM Member JOIN Admin ON Member.mem_id = Admin.mem_id  WHERE Member.mem_id = ${decode.id} AND Admin.mem_id = ${decode.id}`;
      break;
    case "1": //commander
      query = ` SELECT * FROM Member JOIN Commander ON Member.mem_id = Commander.mem_id WHERE Member.mem_id = ${decode.id} AND Commander.mem_id = ${decode.id}`;
      break;
    case "2": //Scene Investigator
      query = ` SELECT * FROM Member JOIN Scene_investigators ON Member.mem_id = Scene_investigators.mem_id WHERE Member.mem_id = ${decode.id} AND Scene_investigators.mem_id = ${decode.id}`;
      break;
    case "3": //Director
      query = ` SELECT * FROM Member JOIN Director ON Member.mem_id = Director.mem_id WHERE Member.mem_id = ${decode.id} AND Director.mem_id = ${decode.id}`;
      break;
    case "4": //Expert
      query = ` SELECT * FROM Member JOIN Expert ON Member.mem_id = Expert.mem_id WHERE Member.mem_id = ${decode.id} AND Expert.mem_id = ${decode.id}`;
      break;
    default:
      return null;
  }
  const [rows] = await mysqlDB.query(query);
  if(!rows) return null;
  
  const member = rows[0];
  return {
    id: member.mem_id,
    role: member.mem_type,
    username: member.mem_username,
    fname:
      member.admin_fname ||
      member.com_fname ||
      member.director_fname ||
      member.inves_fname ||
      member.expert_fname,
    lname:
      member.admin_lname ||
      member.com_lname ||
      member.director_lname ||
      member.inves_lname ||
      member.expert_lname,
    nametitle:
      member.com_nametitle ||
      member.director_nametitle ||
      member.inves_nametitle ||
      member.expert_nametitle,
    rank:
      member.com_rank ||
      member.director_rank ||
      member.inves_rank ||
      member.expert_rank,
  };
};

userModel.logout = async (refreshToken: string): Promise<any> => {
  const query = `SELECT * FROM RefreshToken WHERE refresh_token = ?`;
  const [rows] = await mysqlDB.query(query, [refreshToken]);
  if (rows.length === 0) return null;
  const id = rows[0].mem_id;
  const updateQuery = `UPDATE RefreshToken SET refresh_token = ? WHERE mem_id = ?`;
  await mysqlDB.query(updateQuery, [null, id]);
  return true;
};

export default userModel;
