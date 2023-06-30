import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import adminModel from "../../models/adminModel";

const CreateAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { admin_fname, admin_lname, username, password } = req.body;
    const data = { admin_fname, admin_lname, username, password };
    const response = await adminModel.create(data);
    if (!response) {
      res.status(500).json({
        status: "500",
        message: "Error creating admin",
      });
      return;
    }
    res.status(200).json({
      status: "200",
      message: "Admin created successfully",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default CreateAdmin;
