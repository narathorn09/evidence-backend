import { mysqlDB } from "../db/mysql";

const assignModel: any = {};

assignModel.getCaseByAssignGroup = async (data: any): Promise<any> => {
  try {
    const { director_id } = data;
    const connection = await mysqlDB.getConnection();
    const queryGetGroupId = `SELECT group_id FROM GroupTable WHERE director_id=${director_id}`;
    const [resultGroupId] = await connection.query(queryGetGroupId);

    const groupId = resultGroupId[0]?.group_id;
    const queryGetAssign = `
            SELECT 
                c.case_id,
                c.case_numboko,
                c.case_save_date,
                c.case_save_time,
                c.case_accident_date,
                c.case_accident_time,
                c.case_location,
                c.case_type,
                c.case_status,
                c.inves_id,
                JSON_ARRAYAGG(JSON_OBJECT(
                    'evidence_id', e.evidence_id,
                    'evidence_amount', e.evidence_amount,
                    'case_id', e.case_id,
                    'type_e_id', e.type_e_id,
                    'evidence_factor', (
                        SELECT JSON_ARRAYAGG(JSON_OBJECT(
                            'ef_id', ef.ef_id,
                            'ef_photo', ef.ef_photo,
                            'ef_detail', ef.ef_detail,
                            'ef_status', ef.ef_status,
                            'evidence_id', ef.evidence_id,
                            'assign_id', a.assign_id,
                            'assign_direc_status', a.assign_direc_status,
                            'assign_evi_result', a.assign_evi_result,
                            'assign_exp_status', a.assign_exp_status,
                            'case_id', a.case_id,
                            'group_id', a.group_id,
                            'expert_id', a.expert_id
                        ))
                        FROM Evidence_Factor ef
                        LEFT JOIN Assign a ON ef.ef_id = a.ef_id
                        WHERE ef.evidence_id = e.evidence_id AND a.group_id = ? 
                    )
                )) AS evidence_list
            FROM CaseTable c
            LEFT JOIN Evidence e ON c.case_id = e.case_id
            WHERE EXISTS (
                SELECT 1
                FROM Evidence_Factor ef
                LEFT JOIN Assign a ON ef.ef_id = a.ef_id AND a.group_id = ?
                WHERE ef.evidence_id = e.evidence_id AND a.group_id = ? 
            ) 
            GROUP BY c.case_id;`;

    const [resultGetAssign] = await connection.query(queryGetAssign, [
      groupId,
      groupId,
      groupId,
    ]);

    await connection.release();
    return resultGetAssign;
  } catch (err) {
    throw err;
  }
};

export default assignModel;
