import { Router } from "express";
import {
  createTier,
  getTiers,
  getTierById,
  updateTier,
  deleteTier
} from "../controllers/tier.controller";
import { authenticateJWT, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

// Protect all routes with JWT and roles
router.use(authenticateJWT, authorizeRole(["ADMIN", "SUPER_ADMIN"]));

router.post("/", createTier);
router.get("/", getTiers);
router.get("/:id", getTierById);
router.put('/:id', updateTier);
router.delete('/:id', deleteTier);

export default router;
