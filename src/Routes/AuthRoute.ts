import { Router } from "express";
import AuthController from "../Controller/AuthController";
import { __prod__ } from "../constants";

const router = Router();

const setToken = (res: any, token: string) => {
  res.cookie("token", token, {
    maxAge: 3600000,
    httpOnly: false,
    sameSite: "none",
    secure: __prod__,
  });
}

router.post("/signup", async (req, res) => {
  try {
    const clone = { ...req.body };
    const { password } = clone;
    const userData = await AuthController.signup(clone);
    const { token } = await AuthController.signin(userData.email, password);
    setToken(res, token);
    res.json({ auth: true, user: userData, token });
  } catch (err: any) {
    res.status(400).send({ auth: false, token: null, msg: err.message });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const clone = { ...req.body };
    const { token, userData } = await AuthController.signin(clone.email, clone.password);
    setToken(res, token);
    res.json({ auth: true, user: userData, token });
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
