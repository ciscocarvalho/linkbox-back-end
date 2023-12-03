import { IUser } from "../../models/User";
import DashboardController from "../../controllers/DashboardController";
import { CommonSanitizer } from "./CommonSanitizer";

export class AuthSanitizer {
  static sanitizeSignup(userData: Partial<IUser>) {
    userData = { ...userData };
    userData = this.sanitizeEmailAndPassword(userData);
    userData.dashboards = [DashboardController.getDefault()];

    return {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      dashboards: userData.dashboards,
    };
  }

  static sanitizeSignin(userData: Partial<IUser>) {
    userData = { ...userData };
    userData = this.sanitizeEmailAndPassword(userData);
    return { email: userData.email, password: userData.password };
  }

  private static sanitizeEmailAndPassword(userData: Partial<IUser>) {
    userData = { ...userData };

    (["email", "password"] as const).forEach((field) => {
      userData[field] = CommonSanitizer.sanitizeString(userData[field]);
    });

    return userData;
  }
}
