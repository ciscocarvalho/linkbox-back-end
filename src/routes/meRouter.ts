import { Router } from "express";
import UserController from "../controllers/UserController";
import isAuthenticated from "../middlewares/isAuthenticated";

export const meRouter = Router();

meRouter.use(isAuthenticated);

meRouter.get("/", async (req, res) => {
  try {
    const userId = req.session!.userId!;
    const user = await UserController.getById(userId);
    res.sendData({ user });
  } catch (error: any) {
    res.handleError(error);
  }
});

meRouter.put("/", async (req, res) => {
  try {
    const userId = req.session!.userId!;
    const updatedUserData = { ...req.body };
    const user = await UserController.update(userId, updatedUserData);
    res.sendData({ user });
  } catch (error: any) {
    res.handleError(error);
  }
});

meRouter.delete("/", async (req, res) => {
  try {
    const userId = req.session!.userId!;
    const user = await UserController.delete(userId);
    res.sendData({ user });
  } catch (error: any) {
    res.handleError(error);
  }
});

meRouter.put("/change-password", async (req, res) => {
  try {
    const userId = req!.session!.userId!;
    const clone = { ...req.body };
    const { currentPassword, newPassword } = clone;
    const user = await UserController.changePassword(userId, currentPassword, newPassword);
    res.sendData({ user });
  } catch (error: any) {
    res.handleError(error);
  }
});

export default meRouter;
