import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ROUNDS, SECRET } from "../constants";
import { AuthValidator } from "../utils/validators/AuthValidator";
import { AuthSanitizer } from "../utils/sanitizers/AuthSanitizer";

class AuthController {
  static async signup(userCandidate: Partial<IUser>) {
    userCandidate = AuthSanitizer.sanitizeSignup(userCandidate);
    const validation = await AuthValidator.validateSignup(userCandidate);

    if (validation.errors) {
      throw validation.errors;
    }

    userCandidate.password = bcrypt.hashSync(userCandidate.password!, ROUNDS);
    return await new User(userCandidate).save();
  }

  static async signin(userCandidate: Partial<IUser>) {
    userCandidate = AuthSanitizer.sanitizeSignin(userCandidate)
    const validation = await AuthValidator.validateSignin(userCandidate)

    if (validation.errors) {
      throw validation.errors;
    }

    const { user } = validation.data;
    const token = this.generateToken(user);
    return { token, email: userCandidate.email };
  }

  private static generateToken(user: IUser) {
    const token = jwt.sign({ id: user.id }, SECRET, {
      expiresIn: "1h",
    });
    return token;
  }
}

export default AuthController;
