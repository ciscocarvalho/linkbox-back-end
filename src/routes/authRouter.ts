import { Router } from "express";
import AuthController from "../controllers/AuthController";

const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const clone = { ...req.body };
    const { password } = clone;
    const user = await AuthController.signup(clone);
    const { token } = await AuthController.signin(user.email, password);
    res.sendData({ auth: true, user, token });
  } catch (error: any) {
    res.handleError(error);
  }
});

authRouter.post("/signin", async (req, res) => {
  try {
    const clone = { ...req.body };
    const { token, userData: user } = await AuthController.signin(clone.email, clone.password);
    res.sendData({ auth: true, user, token });
  } catch (error: any) {
    res.handleError(error);
  }
});

authRouter.post("/signout", async (req, res) => {
  try {
    res.sendData({ auth: false, user: null, token: null });
  } catch (error: any) {
    res.handleError(error);
  }
});

export default authRouter;
