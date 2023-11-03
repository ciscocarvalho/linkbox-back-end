import { Router } from "express";
import UserController from "../Controller/UserController";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const u = await UserController.getAll();
    res.status(200).json(u);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const u = await UserController.getById(userId);
    res.status(200).json(u);
  } catch (error) {
    res.status(404).json(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUserData = req.body;
    UserController.put(userId, updatedUserData);
  } catch (error) {
    res.status(400).json(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const u = await UserController.delete(userId);
    res.status(200).json(u);
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
