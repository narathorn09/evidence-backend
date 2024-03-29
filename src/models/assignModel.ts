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
                c.case_summary_text,
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
                            'assign_exp_close_work', a.assign_exp_close_work,
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

assignModel.getCaseAssignByCaseId = async (data: any): Promise<any> => {
  try {
    const { director_id, case_id } = data;
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
                c.case_summary_text,
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
                            'assign_exp_close_work', a.assign_exp_close_work,
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
            ) AND c.case_id = ?`;

    const [resultGetAssign] = await connection.query(queryGetAssign, [
      groupId,
      groupId,
      groupId,
      case_id,
    ]);

    await connection.release();
    return resultGetAssign;
  } catch (err) {
    throw err;
  }
};

assignModel.getCaseByExpertId = async (expertId: Number): Promise<any> => {
  try {
    const connection = await mysqlDB.getConnection();

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
        c.case_summary_text,
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
              'assign_exp_close_work', a.assign_exp_close_work,
              'case_id', a.case_id,
              'group_id', a.group_id,
              'expert_id', a.expert_id
            ))
            FROM Evidence_Factor ef
            LEFT JOIN Assign a ON ef.ef_id = a.ef_id
            WHERE ef.evidence_id = e.evidence_id AND a.expert_id = ? 
          )
        )) AS evidence_list
      FROM CaseTable c
      LEFT JOIN Evidence e ON c.case_id = e.case_id
      WHERE EXISTS (
        SELECT 1
        FROM Evidence_Factor ef
        LEFT JOIN Assign a ON ef.ef_id = a.ef_id AND a.expert_id = ?
        WHERE ef.evidence_id = e.evidence_id AND a.expert_id = ? 
      ) 
      GROUP BY c.case_id;`;

    const [resultGetAssign] = await connection.query(queryGetAssign, [
      expertId,
      expertId,
      expertId,
    ]);

    await connection.release();
    return resultGetAssign;
  } catch (err) {
    throw err;
  }
};

assignModel.getCaseByExpertIdAndCaseId = async (data: any): Promise<any> => {
  try {
    const { expert_id, case_id } = data;
    const connection = await mysqlDB.getConnection();

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
        c.case_summary_text,
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
              'assign_exp_close_work', a.assign_exp_close_work,
              'case_id', a.case_id,
              'group_id', a.group_id,
              'expert_id', a.expert_id
            ))
            FROM Evidence_Factor ef
            LEFT JOIN Assign a ON ef.ef_id = a.ef_id
            WHERE ef.evidence_id = e.evidence_id AND a.expert_id = ? 
          )
        )) AS evidence_list
      FROM CaseTable c
      LEFT JOIN Evidence e ON c.case_id = e.case_id
      WHERE EXISTS (
        SELECT 1
        FROM Evidence_Factor ef
        LEFT JOIN Assign a ON ef.ef_id = a.ef_id AND a.expert_id = ?
        WHERE ef.evidence_id = e.evidence_id AND a.expert_id = ? 
      ) AND c.case_id = ?`;

    const [resultGetAssign] = await connection.query(queryGetAssign, [
      expert_id,
      expert_id,
      expert_id,
      case_id,
    ]);

    await connection.release();
    return resultGetAssign;
  } catch (err) {
    throw err;
  }
};

assignModel.directorAcceptCaseAssign = async (data: any): Promise<any> => {
  try {
    const { case_id, director_id } = data;
    const connection = await mysqlDB.getConnection();
    const queryGetGroupId = `SELECT group_id FROM GroupTable WHERE director_id=${director_id}`;
    const [resultGroupId] = await connection.query(queryGetGroupId);
    const groupId = resultGroupId[0]?.group_id;

    const updateQuery = `
    UPDATE Assign AS a
    JOIN Evidence_Factor AS e ON a.ef_id = e.ef_id
    SET a.assign_direc_status = '1', e.ef_status = '2'
    WHERE a.case_id = ? AND a.group_id = ?;
    `;

    const [result] = await connection.query(updateQuery, [case_id, groupId]);

    await connection.release();
    if (result?.affectedRows === 0) return null;
    return result;
  } catch (err) {
    throw err;
  }
};

assignModel.directorCancelCaseAssign = async (data: any): Promise<any> => {
  try {
    const { case_id, director_id } = data;
    const connection = await mysqlDB.getConnection();
    const queryGetGroupId = `SELECT group_id FROM GroupTable WHERE director_id=${director_id}`;
    const [resultGroupId] = await connection.query(queryGetGroupId);
    const groupId = resultGroupId[0]?.group_id;

    const updateQuery = `
    UPDATE Assign AS a
    JOIN Evidence_Factor AS e ON a.ef_id = e.ef_id
    SET a.assign_direc_status = '0',
        e.ef_status = '0',
        a.group_id = NULL
    WHERE a.case_id = ? AND a.group_id = ?;
  `;

    const [result] = await connection.query(updateQuery, [case_id, groupId]);

    await connection.release();
    if (result?.affectedRows === 0) return null;
    return result;
  } catch (err) {
    throw err;
  }
};

assignModel.directorAssignEvidence = async (data: any): Promise<any> => {
  try {
    const { dataForAssign } = data;
    const { expert_id, case_id, group_id } = dataForAssign;
    const connection = await mysqlDB.getConnection();

    const updateQuery = `
        UPDATE Assign AS a
        SET a.expert_id = ?
        WHERE a.case_id = ? AND a.group_id = ?;
      `;
    await connection.query(updateQuery, [expert_id, case_id, group_id]);

    await connection.release();
    return "assign evidence success.";
  } catch (err) {
    throw err;
  }
};

assignModel.countAssignEvidence = async (data: any): Promise<any> => {
  try {
    const { expertId } = data;
    const connection = await mysqlDB.getConnection();

    const countQuery = `
        SELECT COUNT(expert_id) AS count FROM Assign WHERE expert_id = ? AND assign_evi_result IS NULL;
      `;
    const [count] = await connection.query(countQuery, [expertId]);

    await connection.release();

    return count ? count[0].count : null;
  } catch (err) {
    throw err;
  }
};

assignModel.saveResultEvidence = async (data: any): Promise<any> => {
  try {
    const { resultEvidence } = data;
    const connection = await mysqlDB.getConnection();

    resultEvidence.forEach((result: any) => {
      result.evidence_factor.forEach(async (e: any) => {
        const updateQuery = `
        UPDATE Assign AS a
        SET a.assign_evi_result = ?, a.assign_exp_status = ?
        WHERE a.assign_id = ?;
      `;
        await connection.query(updateQuery, [
          e.assign_evi_result,
          e.assign_exp_status,
          e.assignId,
        ]);
      });
    });

    await connection.release();

    if (resultEvidence?.length === 0) return null;
    return resultEvidence;
  } catch (err) {
    throw err;
  }
};

assignModel.expertAcceptWork = async (data: any): Promise<any> => {
  try {
    const { case_id, expert_id } = data;
    const connection = await mysqlDB.getConnection();

    const updateQuery = `
    UPDATE Assign AS a
    SET a.assign_exp_status = '1'
    WHERE a.case_id = ? AND a.expert_id = ?;
    `;

    const [result] = await connection.query(updateQuery, [case_id, expert_id]);

    await connection.release();
    if (result?.affectedRows === 0) return null;
    return result;
  } catch (err) {
    throw err;
  }
};

assignModel.expertCloseWork = async (data: any): Promise<any> => {
  try {
    const { listClose, case_id, case_summary_text } = data;
    const connection = await mysqlDB.getConnection();

    const updateCase = `
        UPDATE CaseTable AS c
        SET c.case_summary_text = ?
        WHERE c.case_id = ?;
      `;
    await connection.query(updateCase, [case_summary_text, case_id]);

    listClose.forEach(async (e: any) => {
      const updateQuery = `
        UPDATE Assign AS a
        SET a.assign_exp_close_work = ?
        WHERE a.assign_id = ?;
      `;
      await connection.query(updateQuery, [
        e.assign_exp_close_work,
        e.assign_id,
      ]);
    });

    await connection.release();

    if (listClose?.length === 0) return null;
    return listClose;
  } catch (err) {
    throw err;
  }
};

assignModel.directorConfirmCase = async (data: any): Promise<any> => {
  try {
    const { listIdEfConfirm } = data;
    const connection = await mysqlDB.getConnection();

    listIdEfConfirm.forEach(async (e: any) => {
      const updateQuery = `
        UPDATE Evidence_Factor AS ef
        SET ef.ef_status = ?
        WHERE ef.ef_id = ?;
    `;
      await connection.query(updateQuery, [
        '3',
        e.ef_id,
      ]);
    });

    await connection.release();

    if (listIdEfConfirm?.length === 0) return null;
    return listIdEfConfirm;
  } catch (err) {
    throw err;
  }
};

export default assignModel;
