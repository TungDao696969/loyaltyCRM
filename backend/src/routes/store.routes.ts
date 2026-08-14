import { Router } from "express";
import {
  createStore,
  getStores,
  getStoreById,
  updateStore,
  deleteStore,
  restoreStore,
} from "../controllers/store.controller";
import { authenticateJWT, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

// Yêu cầu phải đăng nhập (token) và có quyền SUPER_ADMIN mới được thao tác với Store
router.use(authenticateJWT, authorizeRole(["SUPER_ADMIN"]));

router.post("/", createStore);
router.get("/", getStores);
router.get("/:id", getStoreById);
router.put("/:id", updateStore);
router.delete("/:id", deleteStore);
router.put("/:id/restore", restoreStore);

export default router;
