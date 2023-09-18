import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import assignModel from "../../models/assignModel";

const CountAssignEvidence = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { expertId } = req.params;
      const data = { expertId };
      const result = await assignModel.countAssignEvidence(data);
      if (result === null) {
        return res.status(500).json({
          status: "500",
          message: "Error Count Assign Evidence",
        });
      }
      res.status(200).send({ count: result }); // Send the count as JSON
    } catch (err) {
      ResponseError(err, res);
    }
  };
  

export default CountAssignEvidence;