import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import adminModel from "../../models/adminModel";

const UpdateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mem_id, admin_fname, admin_lname, username } = req.body;
    const data = { mem_id, admin_fname, admin_lname, username };
    const update = await adminModel.update(data);
    if (!update) {
      res.status(500).json({
        status: "500",
        message: "Error update admin",
      });
      return;
    }
    res.status(200).json({
      status: "200",
      message: "Admin update successfully",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default UpdateAdmin;
