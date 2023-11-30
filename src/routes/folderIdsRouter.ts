import { Router } from "express";
import isAuthenticated from "../middlewares/isAuthenticated";
import ItemController from "../controllers/ItemController";

const folderIdsRouter = Router();

folderIdsRouter.use(isAuthenticated);

folderIdsRouter.get("/*", (req, res) => {
  try {
    let path = ((req.params as any)[0] as string | undefined) ?? "";
    path = path.split("/").slice(1).join("/");
    const user = req.session!.user!;
    const folder = ItemController.getFolderByPath(user, path);

    if (!folder) {
      throw new Error("Folder not found");
    }

    res.status(200).json({ data: { id: folder._id } });
  } catch (error: any) {
    res.status(400).json({ error: { message: error.message } });
  }
});

export default folderIdsRouter;
