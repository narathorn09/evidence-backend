import { mysqlDB } from "../db/mysql";

interface GroupData {
  group_name: string;
  director_id: number;
}

const groupModel: any = {};

groupModel.create = async (data: GroupData): Promise<GroupData | null> => {
  try {
    const { group_name, director_id } = data;
    const connection = await mysqlDB.getConnection();
    const query = `INSERT INTO GroupTable (group_name, director_id) VALUES (?, ?)`;
    const groupData = [group_name, director_id];
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
        g.group_id, g.group_name,
        d.director_rank, d.director_fname, d.director_lname
    FROM
        GroupTable g
    LEFT JOIN
        Director d ON g.director_id = d.director_id;   
      `;
  const [rows] = await mysqlDB.query(query);
  if(!rows) return null
  return rows;
};

groupModel.deleteGroupById = async (groupId: number): Promise<boolean> => {
  const query = `DELETE FROM GroupTable WHERE group_id=${groupId}`;
  const [rows] = await mysqlDB.query(query);
  return rows ? true : false;
};

export default groupModel;
