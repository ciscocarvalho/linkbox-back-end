import User, { IUser } from "../Model/User";

class UserController {
  static user: IUser;

  static async getById(userId: string) {
    const user = await User.findById(userId, "-password");

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  static async update(userId: string, updatedUserData: IUser) {
    const updatedUser = await User.findByIdAndUpdate(userId, updatedUserData, {
      new: true,
    });

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  }

  static async delete(userId: string) {
    const deletedUser = await User.findByIdAndRemove(userId);

    if (!deletedUser) {
      throw new Error("User not found");
    }

    return deletedUser;
  }
}

export default UserController;
