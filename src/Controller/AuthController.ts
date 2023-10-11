import User, { IUser } from "../Model/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthController {
  static user: IUser;

  constructor(user) {
    AuthController.user = user;
  }

  static genToken(user) {
    const token = jwt.sign({ id: user.id }, process.env.SECRET, {
      expiresIn: "1h",
    });
    return token;
  }

  async signup(userT): Promise<any> {
    

    try {
      const newUser = new User(userT);
      await newUser.save();
      return newUser;
    } catch (err) {
      throw new Error(err.message);
    }
  }


  async signin(email, password): Promise<any> {
    const user = await User.findOne({ email: email });

    if (!user) {
      throw "error usuário não encontrado";
    }
    const token = AuthController.genToken(user);

    return { token, userData: email  };
  }
}

export default AuthController;
