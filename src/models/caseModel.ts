import { mysqlDB } from "../db/mysql";

interface CaseData {
  case_id: Number;
  case_numboko: String;
  case_save_date: String;
  case_save_time: String;
  case_accident_date: String;
  case_accident_time: String;
  case_location: String;
  case_type: String;
  case_status: Number;
  inves_id: Number;
  evidence_list: [];
}

const caseModel: any = {};

caseModel.create = async (data: CaseData): Promise<any | null> => {
  try {
    const connection = await mysqlDB.getConnection();
    try {
      await connection.beginTransaction();
      const {
        case_numboko,
        case_save_date,
        case_save_time,
        case_accident_date,
        case_accident_time,
        case_location,
        case_type,
        inves_id,
        evidence_list,
      } = data;

      const queryCase = `INSERT INTO CaseTable 
    ( case_numboko,
      case_save_date,
      case_save_time,
      case_accident_date,
      case_accident_time,
      case_location,
      case_type,
      case_status,
      inves_id ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const caseData = [
        case_numboko,
        case_save_date,
        case_save_time,
        case_accident_date,
        case_accident_time,
        case_location,
        case_type,
        "0",
        inves_id,
      ];

      let result: any[] = [];

      const [resultCase] = await connection.query(queryCase, caseData);
      if (!resultCase) return null;

      result.push(resultCase);

      evidence_list.forEach(async (evidence: any) => {
        const queryEvidence = `INSERT INTO Evidence (evidence_amount, type_e_id, case_id) VALUES (?, ?, ?)`;
        const evidenceData = [
          evidence.evidence_amount,
          evidence.type_e_id,
          resultCase.insertId,
        ];
        const [resultEvidence] = await connection.query(
          queryEvidence,
          evidenceData
        );
        if (!resultEvidence) return null;

        result.push(resultEvidence);

        evidence.evidence_factor.forEach(async (ef: any, i: number) => {
          const queryEvidenceFactor = `INSERT INTO Evidence_Factor (ef_status, evidence_id, ef_photo, ef_detail) VALUES (?, ?, ?, ?)`;
          const evidenceFactorData = [
            ef.assignGroupId ? "1" : "0",
            resultEvidence.insertId,
            ef.ef_photo,
            ef.ef_detail,
          ];
          const [resultEvidenceFactor] = await connection.query(
            queryEvidenceFactor,
            evidenceFactorData
          );
          if (!resultEvidenceFactor) return null;

          result.push(resultEvidenceFactor);

          const queryAssign = `INSERT INTO Assign (assign_direc_status, assign_evi_result, assign_exp_status, case_id, ef_id, group_id, expert_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
          const assignData = [
            "0",
            null,
            "0",
            resultCase.insertId,
            resultEvidenceFactor.insertId,
            ef.assignGroupId,
            null,
          ];
          const [resultAssign] = await connection.query(
            queryAssign,
            assignData
          );
          if (!resultAssign) return null;

          result.push(resultAssign);
        });
      });

      console.log("result", result);
      await connection.commit();
      connection.release();
      return result || null;
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

caseModel.update = async (data: any): Promise<any | null> => {
  try {
    const connection = await mysqlDB.getConnection();
    try {
      await connection.beginTransaction();
      const {
        case_id,
        case_numboko,
        case_save_date,
        case_save_time,
        case_accident_date,
        case_accident_time,
        case_location,
        case_type,
        inves_id,
        defEvidence,
        removeEvidenceFactorInDef,
        newEvidence,
        removeEvidence,
      } = data;

      const queryCase = `UPDATE CaseTable 
      SET 
        case_numboko = ?,
        case_save_date = ?,
        case_save_time = ?,
        case_accident_date = ?,
        case_accident_time = ?,
        case_location = ?,
        case_type = ?
      WHERE
        case_id = ?`;

      const caseData = [
        case_numboko,
        case_save_date,
        case_save_time,
        case_accident_date,
        case_accident_time,
        case_location,
        case_type,
        case_id,
      ];

      let result: any[] = [];

      const [resultCase] = await connection.query(queryCase, caseData);
      if (!resultCase) return null;

      result.push(resultCase);

      if (removeEvidenceFactorInDef.length > 0) {
        const queryRemoveEf = `DELETE FROM Evidence_Factor WHERE ef_id IN (?);`;
        const dataRemoveEf = [removeEvidenceFactorInDef];
        const [resultRemoveEf] = await connection.query(
          queryRemoveEf,
          dataRemoveEf
        );
        if (!resultRemoveEf) return null;
      }

      if (removeEvidence.length > 0) {
        const queryRemoveE = `DELETE FROM Evidence WHERE evidence_id IN (?);`;
        const dataRemoveE = [removeEvidence];
        const [resultRemoveE] = await connection.query(
          queryRemoveE,
          dataRemoveE
        );
        if (!resultRemoveE) return null;
      }

      if (newEvidence.length > 0) {
        newEvidence.forEach(async (evidence: any) => {
          const queryEvidence = `INSERT INTO Evidence (evidence_amount, type_e_id, case_id) VALUES (?, ?, ?)`;
          const evidenceData = [
            evidence.evidence_amount,
            evidence.type_e_id,
            case_id,
          ];
          const [resultEvidence] = await connection.query(
            queryEvidence,
            evidenceData
          );
          if (!resultEvidence) return null;

          evidence.evidence_factor.forEach(async (ef: any, i: number) => {
            const queryEvidenceFactor = `INSERT INTO Evidence_Factor (ef_status, evidence_id, ef_photo, ef_detail) VALUES (?, ?, ?, ?)`;
            const evidenceFactorData = [
              ef.assignGroupId ? "1" : "0",
              resultEvidence.insertId,
              ef.ef_photo,
              ef.ef_detail,
            ];
            const [resultEvidenceFactor] = await connection.query(
              queryEvidenceFactor,
              evidenceFactorData
            );
            if (!resultEvidenceFactor) return null;

            result.push(resultEvidenceFactor);

            const queryAssign = `INSERT INTO Assign (assign_direc_status, assign_evi_result, assign_exp_status, case_id, ef_id, group_id, expert_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            const assignData = [
              "0",
              null,
              "0",
              case_id,
              resultEvidenceFactor.insertId,
              ef.assignGroupId,
              null,
            ];
            const [resultAssign] = await connection.query(
              queryAssign,
              assignData
            );
            if (!resultAssign) return null;

            result.push(resultAssign);
          });
        });
      }

      if (defEvidence.length > 0) {
        defEvidence.forEach(async (evidence: any) => {
          const queryEvidence = `
          UPDATE Evidence 
          SET 
            evidence_amount = ?,
            type_e_id = ?
          WHERE
            evidence_id = ?`;
          const dataEvidence = [
            evidence.evidence_amount,
            evidence.type_e_id,
            evidence.evidence_id,
          ];
          const [resultEvidence] = await connection.query(
            queryEvidence,
            dataEvidence
          );
          if (!resultEvidence) return null;

          evidence.evidence_factor.forEach(async (ef: any) => {
            if (!(typeof ef.ef_id === "number")) {
              const queryEvidenceFactor = `INSERT INTO Evidence_Factor (ef_status, evidence_id, ef_photo, ef_detail) VALUES (?, ?, ?, ?)`;
              const evidenceFactorData = [
                ef.assignGroupId ? "1" : "0",
                evidence.evidence_id,
                ef.ef_photo,
                ef.ef_detail,
              ];
              const [resultEvidenceFactor] = await connection.query(
                queryEvidenceFactor,
                evidenceFactorData
              );
              if (!resultEvidenceFactor) return null;

              result.push(resultEvidenceFactor);

              const queryAssign = `INSERT INTO Assign (assign_direc_status, assign_evi_result, assign_exp_status, case_id, ef_id, group_id, expert_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
              const assignData = [
                "0",
                null,
                "0",
                case_id,
                resultEvidenceFactor.insertId,
                ef.assignGroupId,
                null,
              ];
              const [resultAssign] = await connection.query(
                queryAssign,
                assignData
              );
              if (!resultAssign) return null;

              result.push(resultAssign);
            } else {
              const queryEvidenceFactor = `UPDATE Evidence_Factor SET ef_status = ?, ef_photo = ?, ef_detail = ? WHERE ef_id = ?`;
              const evidenceFactorData = [
                ef.assignGroupId_remove ? "0" : ef.assignGroupId ? "1" : ef.ef_status,
                ef.ef_photo,
                ef.ef_detail,
                ef.ef_id,
              ];
              const [resultEvidenceFactor] = await connection.query(
                queryEvidenceFactor,
                evidenceFactorData
              );
              if (!resultEvidenceFactor) return null;

              result.push(resultEvidenceFactor);

              const queryAssign = `UPDATE Assign SET assign_direc_status = ?, assign_evi_result = ?, assign_exp_status = ?, group_id = ?, expert_id = ? WHERE case_id = ? AND ef_id = ?`;
              const assignData = [
                "0",
                null,
                "0",
                ef.assignGroupId_remove ? null : ef.assignGroupId || ef.group_id,
                ef.expert_id,
                case_id,
                ef.ef_id,
              ];
              const [resultAssign] = await connection.query(
                queryAssign,
                assignData
              );
              if (!resultAssign) return null;
            }
          });
        });
      }

      await connection.commit();
      connection.release();
      return result || null;
    } catch (err) {
      await connection.rollback();
      connection.release();
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

caseModel.getAllCaseByInvesId = async (
  InvesId: number
): Promise<any | null> => {
  try {
    const connection = await mysqlDB.getConnection();
    try {
      const query = "SELECT * FROM CaseTable WHERE inves_id = ?";
      const [result] = await connection.query(query, InvesId);

      await connection.release();
      return result || null;
    } catch (err) {
      await connection.release();
      throw err;
    }
  } catch (err) {
    throw err;
  }
};

caseModel.getCaseById = async (caseId: number): Promise<any | null> => {
  try {
    const connection = await mysqlDB.getConnection();
    try {
      const queryCase = "SELECT * FROM CaseTable WHERE case_id = ?";
      const [resultCase] = await connection.query(queryCase, caseId);

      const queryEvidence = "SELECT * FROM Evidence WHERE case_id = ?";
      const [resultEvidence] = await connection.query(queryEvidence, caseId);

      for (const evidence of resultEvidence) {
        const queryEvidenceFactor = `SELECT 
            ef.ef_id,
            ef.ef_photo,
            ef.ef_detail,
            ef.ef_status,
            ef.evidence_id,
            a.assign_id,
            a.assign_direc_status,
            a.assign_evi_result,
            a.assign_exp_status,
            a.case_id,
            a.group_id,
            a.expert_id
        FROM 
            Evidence_Factor ef
        JOIN 
            Assign a ON ef.ef_id = a.ef_id
        WHERE
            evidence_id = ?;
        `;
        const [resultEvidenceFactor] = await connection.query(
          queryEvidenceFactor,
          evidence.evidence_id
        );

        evidence.evidence_factor = resultEvidenceFactor;
      }

      const resultAll = [{ ...resultCase[0], evidence_list: resultEvidence }];

      await connection.release();
      return resultAll || null;
    } catch (err) {
      await connection.release();
      throw err;
    }
  } catch (err) {
    throw err;
  }
};


caseModel.deleteById = async (case_id: number): Promise<boolean> => {
  try {
    const connection = await mysqlDB.getConnection();
    const query = `DELETE FROM CaseTable WHERE case_id=${case_id}`;
    const [result] = await connection.query(query);
    await connection.release();
    return result ? true : false;
  } catch (err) {
    throw err;
  }
};

export default caseModel;
