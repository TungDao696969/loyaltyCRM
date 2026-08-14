import { Router } from "express";
import {
  createSegment,
  getSegments,
  getSegmentById,
  updateSegment,
  deleteSegment,
  getSegmentCustomers
} from "../controllers/segment.controller";
import { authenticateJWT, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticateJWT, authorizeRole(["ADMIN", "SUPER_ADMIN"]));

router.get("/:id/customers", getSegmentCustomers); // Get customers matching the RFM

router.post("/", createSegment);
router.get("/", getSegments);
router.get("/:id", getSegmentById);
router.put("/:id", updateSegment);
router.delete("/:id", deleteSegment);

export default router;
