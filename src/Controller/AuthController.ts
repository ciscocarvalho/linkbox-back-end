import User, { IUser } from "../Model/User";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
    console.log("2");

    try {
      const newUser = new User(userT);
      console.log("4");
      const savedUser = await newUser.save();
      console.log("5");

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

    return { token, userData: { email } };
  }
}

export default AuthController;
