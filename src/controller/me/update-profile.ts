import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import userModel from "../../models/userModel";

const UpdateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, role, fname, lname, username, nametitle, rank } = req.body;
    const data = { id, role, fname, lname, username , nametitle, rank };
    const response = await userModel.updateProfile(data);
    if (!response) {
      return res.status(500).json({
        status: "500",
        message: "Error update profile",
      });
    }
    res.status(200).json({
      status: "200",
      message: "Profile update successfully",
    });
  } catch (err) {
    ResponseError(err, res);
  }
};

export default UpdateProfile;