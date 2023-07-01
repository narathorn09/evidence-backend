import { mysqlDB } from "../db/mysql";
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

interface AdminData {
  admin_fname: string;
  admin_lname: string;
  username: string;
  password: string;
}

const adminModel: any = {};

adminModel.create = async (data: AdminData): Promise<AdminData | null> => {
  try {
    const { admin_fname, admin_lname, username, password } = data;
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const connection = await mysqlDB.getConnection(); 

    try {
      await connection.beginTransaction(); 

      const memQuery =
        "INSERT INTO Member (mem_type, mem_username, mem_password) VALUES (?, ?, ?)";
      const memData = ["0", username, hash];
      const [resultMem] = await connection.query(memQuery, memData);

      const adminQuery =
        "INSERT INTO Admin (admin_fname, admin_lname, mem_id) VALUES (?, ?, ?)";
      const adminData = [admin_fname, admin_lname, resultMem.insertId];
      const [resultAdmin] = await connection.query(adminQuery, adminData);

      await connection.commit(); 
      connection.release(); 
      return resultAdmin as AdminData;
    } catch (err) {
      await connection.rollback(); 
      connection.release();
      throw new Error("Error creating admin");
    }
  } catch (err) {
    throw new Error("Error creating admin");
  }
};

adminModel.getAll = async (): Promise<[]> => {
  const query = ` 
        SELECT
        Member.mem_id, Member.mem_type, Member.mem_username, 
        Admin.admin_id, Admin.admin_fname, Admin.admin_lname
        FROM Member
        JOIN Admin ON Member.mem_id = Admin.mem_id;    
      `;
  const [rows] = await mysqlDB.query(query);
  return rows.length > 0 ? rows : [];
};

export default adminModel;
