import { Router } from "express";
import AuthController from "../Controller/AuthController";

const router = Router();

router.post("/signup", async (req, res) => {
  try {
    const clone = { ...req.body };
    const userSaved = await AuthController.signup(clone);
    res.status(201).json({ email: userSaved.email });
  } catch (err: any) {
    res.status(400).send({ msg: err.message });
  }
});

router.post("/signin", async (req, res) => {
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
  } catch (err: any) {
    res.status(401).send({ auth: false, token: null, msg: err.message });
  }
});

router.post("/signout", async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(201);
  } catch (err: any) {
    res.status(401).send({ msg: err.message });
  }
});

export default router;
