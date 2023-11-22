import { Router } from "express";
import isAuthenticated from "../Middlewares/isAuthenticated";
import { getItemByPath, getUserOrThrowError } from "../util/controller";

const router = Router();

router.use(isAuthenticated);

router.get("/*", async (req, res) => {
  try {
    let path = (req.params as any)[0] as string | undefined ?? "";
    path = path.split("/").slice(1).join("/");
    const userId = req.session!.userId!;
    const user = await getUserOrThrowError(userId);
    const item = await getItemByPath(user, path);

    if (!item) {
      throw new Error("Item not found");
    }

    res.status(200).json({ _id: item._id });
  } catch (error: any) {
    res.status(400).json({ msg: error.message });
  }
});

export default router;
