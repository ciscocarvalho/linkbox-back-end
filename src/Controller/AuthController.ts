import User, { IUser } from "../Model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const ROUNDS = parseInt(process.env.ROUNDS!);

class AuthController {
  static user: IUser;

  constructor(user: IUser) {
    AuthController.user = user;
  }

  static genToken(user: IUser) {
    const token = jwt.sign({ id: user.id }, process.env.SECRET!, {
      expiresIn: "1h",
    });
    return token;
  }

  static async signup(userT: IUser) {
    userT.password = bcrypt.hashSync(userT.password, ROUNDS);
    const newUser = await new User(userT).save();
    return newUser;
  }

  static async signin(email: string, password: string) {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("User not found");
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      throw new Error("Invalid password");
    }
    const token = AuthController.genToken(user);

    return { token, userData: email };
  }
}

export default AuthController;
