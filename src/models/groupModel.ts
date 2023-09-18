import { mysqlDB } from "../db/mysql";

interface GroupData {
  group_id: number;
  group_name: string;
  group_status: string;
  director_id: number;
}

const groupModel: any = {};

groupModel.create = async (data: GroupData): Promise<GroupData | null> => {
  try {
    const { group_name, group_status, director_id } = data;
    const connection = await mysqlDB.getConnection();
    const query = `INSERT INTO GroupTable (group_name, group_status,director_id) VALUES (?, ?, ?)`;
    const groupData = [group_name,group_status, director_id];
    const [result] = await connection.query(query, groupData);
    if (!result) {
      connection.release();
      return null;
    }
    connection.release();
    return result as GroupData;
  } catch (err) {
    throw err;
  }
};

groupModel.update = async (data: GroupData): Promise<GroupData | null> => {
  try {
    const { group_id, group_name, group_status, director_id } = data;
    const connection = await mysqlDB.getConnection();
    const query = `UPDATE GroupTable SET group_name = ?, director_id = ? , group_status = ? WHERE group_id = ?`;
    const groupData = [group_name, director_id, group_status, group_id];
    const [result] = await connection.query(query, groupData);
    if (!result) {
      connection.release();
      return null;
    }
    connection.release();
    return result as GroupData;
  } catch (err) {
    throw err;
  }
};

groupModel.getAll = async (): Promise<[] | null> => {
  const query = ` 
    SELECT
        g.group_id, g.group_name, g.group_status,
        d.director_id, d.director_rank, d.director_fname, d.director_lname
    FROM
        GroupTable g
    LEFT JOIN
        Director d ON g.director_id = d.director_id;   
      `;
  const [rows] = await mysqlDB.query(query);
  if(!rows) return null
  return rows;
};

groupModel.getById = async (id: number): Promise<[] | null> => {
  const query = ` 
  SELECT
    g.group_name, g.director_id,  g.group_status,
    d.director_rank, d.director_fname, d.director_lname
  FROM
    GroupTable g
  LEFT JOIN
    Director d ON g.director_id = d.director_id   
  WHERE g.group_id = ?;
      `;
  const [rows] = await mysqlDB.query(query, [id]);
  if (!rows) return null;
  return rows;
};

groupModel.getByDirectorId = async (id: number): Promise<[] | null> => {
  const query = ` 
  SELECT
    g.group_id, g.group_name
  FROM
    GroupTable g
  WHERE g.director_id = ?;
      `;
  const [rows] = await mysqlDB.query(query, [id]);
  if (!rows) return null;
  return rows;
};

groupModel.deleteGroupById = async (groupId: number): Promise<boolean> => {
  const query = `DELETE FROM GroupTable WHERE group_id=${groupId}`;
  const [rows] = await mysqlDB.query(query);
  return rows ? true : false;
};

export default groupModel;
