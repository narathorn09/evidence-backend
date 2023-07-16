import { Request, Response, NextFunction } from "express";
import ResponseError from "../../components/responseError";
import userModel from "../../models/userModel";

const UpdatePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id, password, new_password } = req.body;
    const user = await userModel.getUserById(id);
    const { mem_password } = user;
    if (!user) return res.status(404).send({ message: "Not found user" });

    const passwordMatch = await userModel.comparePassword(
      password,
      mem_password
    );
    if (passwordMatch) {
      const updatePass = await userModel.updatePassword({ id, new_password });
      if (!updatePass)
        return res.status(500).send({ message: "Update password error" });
      res.status(200).send({ message: "Update password success" });
    } else res.status(200).send(false); //Password Incorrect
  } catch (err) {
    ResponseError(err, res);
  }
};

export default UpdatePassword;
