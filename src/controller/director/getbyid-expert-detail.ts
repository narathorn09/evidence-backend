import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import assignModel from "../../models/assignModel";
import expertModel from "../../models/expertModel";

type CountProps = {
  numCase: number;
  numEvidenceHaveResult: number;
  numEvidenceNoResult: number;
};

const GetExpertDetailByExpertId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { expertId } = req.params;
    const expertData = await expertModel.findById(expertId);
    const name = `${expertData[0].expert_rank}${expertData[0].expert_fname} ${expertData[0].expert_lname}`;
    let count: CountProps = {
      numCase: 0,
      numEvidenceHaveResult: 0,
      numEvidenceNoResult: 0,
    };
    const rows = await assignModel.getCaseByExpertId(expertId);
    if (!rows) {
      return res.status(500).json({
        status: "500",
        message: "Error Get Expert Detail By ExpertId",
      });
    }
    const result = rows.filter((row: any) => {
      return row.evidence_list.every((evidence: any) => {
        return evidence.evidence_factor.every((factor: any) => {
          return factor.assign_exp_close_work === "0" && factor.assign_exp_status !== "0";
        });
      });
    });

    count.numCase = result.length;

    result.forEach((row: any) => {
      row.evidence_list.forEach((evidence: any) => {
        evidence.evidence_factor.forEach((factor: any) => {
          if (factor.assign_exp_status === "2") {
            count.numEvidenceHaveResult += 1;
          } else if (factor.assign_exp_status === "1") {
            count.numEvidenceNoResult += 1;
          }
        });
      });
    });

    res.status(200).send({ count, expertData, name });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default GetExpertDetailByExpertId;
