import { Router } from "express";
import UserController from "../Controller/UserController";
import isAuthenticated from "../Middlewares/isAuthenticated";

const router = Router();

router.use(isAuthenticated);

router.get("/", async (req, res) => {
  try {
    const userId = req.session!.userId!;
    const u = await UserController.getById(userId);
    res.status(200).json(u);
  } catch (error: any) {
    res.status(404).json({ msg: error.message });
  }
});

router.put("/", async (req, res) => {
  try {
    const userId = req.session!.userId!;
    const updatedUserData = { ...req.body };
    await UserController.update(userId, updatedUserData);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

router.delete("/", async (req, res) => {
  try {
    const userId = req.session!.userId!;
    const u = await UserController.delete(userId);
    res.status(200).json(u);
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

export default router;
