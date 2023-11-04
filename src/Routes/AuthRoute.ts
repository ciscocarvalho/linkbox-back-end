import { Request, Response, Router } from "express";
import AuthController from "../Controller/AuthController";

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const clone = { ...req.body };
    const userSaved = await AuthController.signup(clone);
    res.status(201).json({ email: userSaved.email });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  try {
    const clone = { ...req.body };
    const { token, userData } = await AuthController.signin(clone.email, clone.password);
    res.cookie("token", token, {
      maxAge: 3600000,
      httpOnly: false,
      sameSite: "strict",
      secure: false,
    });
    res.json({ auth: true, user: userData, token: token });
  } catch (err) {
    res.status(401).send({ auth: false, token: null, msg: err.message });
  }
});

export default router;
