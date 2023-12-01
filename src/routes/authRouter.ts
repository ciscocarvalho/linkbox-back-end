import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { __prod__ } from "../constants";

const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const clone = { ...req.body };
    const { password } = clone;
    const user = await AuthController.signup(clone);
    const { token } = await AuthController.signin(user.email, password);
    res.json({ data: { auth: true, user, token } });
  } catch (err: any) {
    res.status(400).json({ error: { message: err.message } });
  }
});

authRouter.post("/signin", async (req, res) => {
  try {
    const clone = { ...req.body };
    const { token, userData: user } = await AuthController.signin(clone.email, clone.password);
    res.json({ data: { auth: true, user, token } });
  } catch (err: any) {
    res.status(401).json({ error: { message: err.message } });
  }
});

authRouter.post("/signout", async (req, res) => {
  try {
    res.status(201).json({ data: { auth: false, user: null, token: null } });
  } catch (err: any) {
    res.status(401).json({ error: { message: err.message } });
  }
});

export default authRouter;
