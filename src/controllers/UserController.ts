import { ROUNDS } from "../constants";
import { USER_NOT_FOUND } from "../constants/responseErrors";
import User, { IUser } from "../models/User";
import UserValidator from "./UserValidator";
import bcrypt from "bcrypt";

class UserController {
  static user: IUser;

  static async getById(userId: string) {
    const user = await User.findById(userId, "-password");

    if (!user) {
      throw USER_NOT_FOUND;
    }

    return user;
  }

  static async update(userId: string, updatedUserData: Partial<IUser>) {
    const user = await this.getById(userId);
    const { errors } = await UserValidator.validateUpdate(user, updatedUserData);

    if (errors.length > 0) {
      throw errors;
    }

    delete updatedUserData.password;

    const updatedUser = user.updateOne(updatedUserData, {
      new: true,
    });

    return updatedUser;
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw USER_NOT_FOUND;
    }

    const { errors } = UserValidator.validateChangePassword(user, currentPassword, newPassword);

    if (errors.length > 0) {
      throw errors;
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, ROUNDS);

    const updatedUser = user.updateOne({
      $set: {
        password: hashedNewPassword,
      },
    }, {
      new: true,
    });

    return updatedUser;
  }

  static async delete(userId: string, password: string) {
    const user = await User.findById(userId);

    if (!user) {
      throw USER_NOT_FOUND;
    }

    const { errors } = UserValidator.validateDelete(user, password);

    if (errors.length > 0) {
      throw errors;
    }

    const deletedUser = await user.deleteOne();
    return deletedUser;
  }
}

export default UserController;
