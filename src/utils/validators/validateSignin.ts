import { IUser } from "../../models/User";
import bcrypt from "bcrypt";

export const validateSignin = async (user: IUser | null, password: string) => {
  if (!user) {
    throw new Error("User not found");
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);

  if (!passwordIsValid) {
    throw new Error("Invalid password");
  }
}
