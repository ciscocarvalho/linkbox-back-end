import { Router } from "express";
import UserController from "../Controller/UserController";
import isAuthenticated from "../Middlewares/isAuthenticated";

const router = Router();

router.use(isAuthenticated);

router.get("/", async (req, res) => {
  try {
    const userId = req.session!.userId!;
    const u = await UserController.getById(userId);
    res.status(200).json({ data: { user: u } });
  } catch (error: any) {
    res.status(404).json({ error: { message: error.message } });
  }
});

router.put("/", async (req, res) => {
  try {
    const userId = req.session!.userId!;
    const updatedUserData = { ...req.body };
    const u = await UserController.update(userId, updatedUserData);
    res.status(200).json({ data: { user: u } });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
});

router.delete("/", async (req, res) => {
  try {
    const userId = req.session!.userId!;
    const u = await UserController.delete(userId);
    res.status(200).json({ data: { user: u } });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
});

export default router;
