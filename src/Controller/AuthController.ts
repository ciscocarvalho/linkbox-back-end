import User, { IUser } from "../Model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";
import { validateSignin } from "../util/validators/validateSignin";

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
    if (!userT.dashboards) {
      userT.dashboards = [];
    }

    const defaultDashboard = {
      name: "default",
      tree: { items: [], _id: new ObjectId().toString() },
    };

    const hasDefaultDashboard = userT.dashboards.findIndex(dashboard => dashboard.name === "default") !== -1;

    if (!hasDefaultDashboard) {
      userT.dashboards.push(defaultDashboard);
    }

    const newUser = await new User(userT).save();
    return newUser;
  }

  static async signin(email: string, password: string) {
    const user = await User.findOne({ email: email });
    validateSignin(user, password);
    const token = AuthController.genToken(user!);

    return { token, userData: email };
  }
}

export default AuthController;
