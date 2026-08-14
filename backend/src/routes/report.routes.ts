import { Router } from "express";
import { getDashboardReport } from "../controllers/report.controller";
import { authenticateJWT, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticateJWT, authorizeRole(["ADMIN", "SUPER_ADMIN"]));

router.get("/dashboard", getDashboardReport);

export default router;
