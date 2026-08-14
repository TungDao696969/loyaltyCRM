import { Router } from "express";
import {
  createVoucher,
  getVouchers,
  getVoucherById,
  updateVoucher,
  deleteVoucher,
  applyVoucher,
  checkVoucher,
  exchangeVoucher,
  getRewards
} from "../controllers/voucher.controller";
import { authenticateJWT, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

router.get("/rewards/catalog", authenticateJWT, getRewards);
router.post("/apply", authenticateJWT, applyVoucher);
router.post("/check", authenticateJWT, checkVoucher);
router.post("/exchange", authenticateJWT, exchangeVoucher);

// Phân quyền CRUD cơ bản cho ADMIN và SUPER_ADMIN
router.use(authenticateJWT, authorizeRole(["ADMIN", "SUPER_ADMIN"]));

router.post("/", createVoucher);
router.get("/", getVouchers);
router.get("/:id", getVoucherById);
router.put('/:id', updateVoucher);
router.delete('/:id', deleteVoucher);

export default router;
