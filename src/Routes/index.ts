import { Router } from "express";
import meRoute from "./meRoute";
import dashboardRoute from "./DashboardRoute";
import authRoute from "./AuthRoute";
import itemRoute from "./itemRoute";
import pathRoute from "./pathRoute";
import idRoute from "./idRoute";
import moveRoute from "./moveRoute";
import repositionRoute from "./repositionRoute";
import urlTitleRoute from "./urlTitleRoute";

const router = Router();

router.use("/me", meRoute);
router.use("/auth", authRoute);
router.use("/dashboards", dashboardRoute);
router.use("/item", itemRoute);
router.use("/path", pathRoute);
router.use("/id", idRoute);
router.use("/move", moveRoute);
router.use("/reposition", repositionRoute);
router.use("/urlTitle", urlTitleRoute);

export default router;
