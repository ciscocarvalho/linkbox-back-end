import { INVALID_PASSWORD, USER_NOT_FOUND } from "../../constants/responseErrors";
import { IUser } from "../../models/User";
import bcrypt from "bcrypt";

export const validateSignin = (user: IUser | null, password: string) => {
  if (!user) {
    throw USER_NOT_FOUND;
  }

  const passwordIsValid = bcrypt.compareSync(password, user.password);

  if (!passwordIsValid) {
    throw INVALID_PASSWORD;
  }
}
