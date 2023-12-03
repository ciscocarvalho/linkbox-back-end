import { EMAIL_ALREADY_USED, EMAIL_NOT_FOUND, PASSWORD_IS_TOO_WEAK, PASSWORD_IS_WRONG, USERNAME_IS_REQUIRED } from "../../constants/responseErrors";
import { EMAIL_IS_REQUIRED, PASSWORD_IS_REQUIRED } from "../../constants/responseErrors";
import User, { IUser } from "../../models/User";
import bcrypt from "bcrypt";

export class AuthValidator {
  static async validateSignup(userData: Partial<IUser>) {
    const errors = [];

    if (!userData.username) {
      errors.push(USERNAME_IS_REQUIRED);
    }

    if (!userData.email) {
      errors.push(EMAIL_IS_REQUIRED);
    } else {
      const user = await User.findOne({ email: userData.email });
      if (user) {
        errors.push(EMAIL_ALREADY_USED);
      }
    }

    if (!userData.password) {
      errors.push(PASSWORD_IS_REQUIRED);
    } else if (userData.password.length < 7) {
      errors.push(PASSWORD_IS_TOO_WEAK);
    }

    return { errors: errors.length === 0 ? undefined : errors };
  }

  static async validateSignin(userData: Partial<IUser>) {
    const errors = [];

    if (!userData.email) {
      errors.push(EMAIL_IS_REQUIRED);
    }

    if (!userData.password) {
      errors.push(PASSWORD_IS_REQUIRED);
    }

    if (errors.length > 0) {
      return { errors };
    }

    const user = await User.findOne({ email: userData.email });

    if (!user) {
      return { errors: [EMAIL_NOT_FOUND] };
    }

    const passwordIsValid = bcrypt.compareSync(userData.password!, user.password);

    if (!passwordIsValid) {
      return { errors: [PASSWORD_IS_WRONG] };
    }

    return { data: { user } };
  }
}
