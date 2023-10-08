import express from "express";

import { Request, Response } from "express";

import User from "../Model/User";

const router = express.Router();

import AuthController from "../Controller/AuthController";

const authService = new AuthController(User);

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const clone = { ...req.body };
    const userSaved = await authService.signup(clone);

    res.status(201).json(userSaved.email);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  try {
    const clone = { ...req.body };
    const { token, userData } = await authService.signin(
      clone.email,
      clone.password
    );
    res.cookie("token", token, {
      maxAge: 3600000,
      httpOnly: true,
      sameSite: "strict",
      secure: false,
    });
    res.json({ auth: true, user: userData /** token: token */ });
  } catch (err) {
    res.status(401).send({ auth: false, token: null, message: err.message });
  }
});

export default router;
