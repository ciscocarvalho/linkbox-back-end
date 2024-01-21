import { CURRENT_PASSWORD_IS_REQUIRED, CURRENT_PASSWORD_IS_WRONG, NEW_PASSWORD_IS_REQUIRED, NEW_PASSWORD_IS_TOO_WEAK } from "../constants/responseErrors/authResponseErrors/changePasswordResponseErrors";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import { AuthValidator } from "../utils/validators/AuthValidator";
import { EMAIL_ALREADY_USED, PASSWORD_IS_REQUIRED, PASSWORD_IS_WRONG } from "../constants/responseErrors";

class UserController {
  static async validateUpdate(user: IUser, updatedUserData: Partial<IUser>) {
    const errors = [];
    const userWithSameEmail = await User.findOne({
      email: updatedUserData.email,
    });

    if (userWithSameEmail && user && userWithSameEmail.id !== user.id) {
      errors.push(EMAIL_ALREADY_USED);
    }

    return { errors };
  }

  static validateChangePassword(user: IUser, currentPassword?: string, newPassword?: string) {
    const errors = [];

    if (!currentPassword) {
      errors.push(CURRENT_PASSWORD_IS_REQUIRED);
    } else if (!bcrypt.compareSync(currentPassword, user.password)) {
      errors.push(CURRENT_PASSWORD_IS_WRONG);
    }

    if (!newPassword) {
      errors.push(NEW_PASSWORD_IS_REQUIRED);
    } else if (!AuthValidator.checkPasswordStrength(newPassword)) {
      errors.push(NEW_PASSWORD_IS_TOO_WEAK);
    }

    return { errors };
  }

  static validateDelete(user: IUser, password?: string) {
    const errors = [];

    if (!password) {
      errors.push(PASSWORD_IS_REQUIRED);
    } else if (!bcrypt.compareSync(password, user.password)) {
      errors.push(PASSWORD_IS_WRONG);
    }

    return { errors };
  }
}

export default UserController;
