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
    const { password } = clone;
    const user = await AuthController.signup(clone);
    const { token } = await AuthController.signin(user.email, password);
    setToken(res, token);
    res.json({ data: { auth: true, user, token } });
  } catch (err: any) {
    res.status(400).json({ error: { message: err.message } });
  }
});

authRouter.post("/signin", async (req, res) => {
  try {
    const clone = { ...req.body };
    const { token, userData: user } = await AuthController.signin(clone.email, clone.password);
    setToken(res, token);
    res.json({ data: { auth: true, user, token } });
  } catch (err: any) {
    res.status(401).json({ error: { message: err.message } });
  }
});

authRouter.post("/signout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(201).json({ data: { auth: false, user: null, token: null } });
  } catch (err: any) {
    res.status(401).json({ error: { message: err.message } });
  }
});

export default authRouter;
