import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { __prod__ } from "../constants";

const authRouter = Router();

const setToken = (res: any, token: string) => {
  res.cookie("token", token, {
    maxAge: 3600000,
    httpOnly: false,
    sameSite: "none",
    secure: __prod__,
  });
}

authRouter.post("/signup", async (req, res) => {
  try {
    const clone = { ...req.body };
    const user = await AuthController.signup({ ...clone });
    const signInData = { ...clone } // WARN: THIS CANNOT BE A MONGODB DOCUMENT
    const { token } = await AuthController.signin(signInData);
    setToken(res, token);
    res.sendData({ auth: true, user, token });
  } catch (error: any) {
    res.handleError(error);
  }
});

authRouter.post("/signin", async (req, res) => {
  try {
    const clone = { ...req.body };
    const { token, email } = await AuthController.signin(clone);
    setToken(res, token);
    res.sendData({ auth: true, email, token });
  } catch (error: any) {
    res.handleError(error);
  }
});

authRouter.post("/signout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.sendData({ auth: false, user: null, token: null });
  } catch (error: any) {
    res.handleError(error);
  }
});

export default authRouter;
