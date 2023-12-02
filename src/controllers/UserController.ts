import { USER_NOT_FOUND } from "../constants/responseErrors";
import User, { IUser } from "../models/User";

class UserController {
  static user: IUser;

  static async getById(userId: string) {
    const user = await User.findById(userId, "-password");

    if (!user) {
      throw USER_NOT_FOUND;
    }

    return user;
  }

  static async update(userId: string, updatedUserData: IUser) {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });

    if (!updatedUser) {
      throw USER_NOT_FOUND;
    }

    return updatedUser;
  }

  static async delete(userId: string) {
    const deletedUser = await User.findByIdAndRemove(userId);

    if (!deletedUser) {
      throw USER_NOT_FOUND;
    }

    return deletedUser;
  }
}

export default UserController;
