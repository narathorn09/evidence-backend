import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import expertModel from "../../models/expertModel";

const ListExpertByGroupId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {groupId} = req.params
    const response = await expertModel.getAllByGroupId(groupId);
    if (!response) {
      return res.status(500).json({
        status: "500",
        message: "Error get all expert",
      });
    }
    res.send(response);
  } catch (err) {
    ResponseError(err, res);
  }
}; 

export default ListExpertByGroupId;
