import { Router } from "express";
import AuthController from "../controllers/AuthController";

const authRouter = Router();

authRouter.post("/signup", async (req, res) => {
  try {
    const clone = { ...req.body };
    const user = await AuthController.signup({ ...clone });
    const signInData = { ...clone } // WARN: THIS CANNOT BE A MONGODB DOCUMENT
    const { token } = await AuthController.signin(signInData);
    res.sendData({ auth: true, user, token });
  } catch (error: any) {
    res.handleError(error);
  }
});

authRouter.post("/signin", async (req, res) => {
  try {
    const clone = { ...req.body };
    const { token, email } = await AuthController.signin(clone);
    res.sendData({ auth: true, email, token });
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
