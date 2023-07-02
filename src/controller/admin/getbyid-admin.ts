import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import adminModel from "../../models/adminModel";

const GetAdminById = async (req: Request, res: Response, next: NextFunction) => {
  try {
   const { memId } = req.params;
   const admin = await adminModel.getById(memId)
      if (!admin) {
        return res.status(500).json({
          status: "500",
          message: "Error get admin by Id",
        });
      } 
      res.send(admin);
  } catch (err) {
    ResponseError(err, res);
  }
};

export default GetAdminById;
