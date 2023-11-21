import { Router } from "express";
import meRoute from "./meRoute";
import dashboardRoute from "./DashboardRoute";
import folderRoute from "./FolderRoute";
import linkRoute from "./LinkRoute";
import authRoute from "./AuthRoute";
import pathRoute from "./pathRoute";
import moveRoute from "./moveRoute";
import repositionRoute from "./repositionRoute";
import urlTitleRoute from "./urlTitleRoute";

const router = Router();

router.use("/me", meRoute);
router.use("/auth", authRoute);
router.use("/dashboards", dashboardRoute);
router.use("/folders", folderRoute);
router.use("/links", linkRoute);
router.use("/path", pathRoute);
router.use("/move", moveRoute);
router.use("/reposition", repositionRoute);
router.use("/urlTitle", urlTitleRoute);

export default router;
