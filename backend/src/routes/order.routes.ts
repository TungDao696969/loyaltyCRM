import { Router } from "express";
import {
  getCustomerOrders,
  createOrder,
  getAllOrders,
} from "../controllers/order.controller";
import { authenticateJWT, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

// Yêu cầu đăng nhập mới được gọi
router.use(authenticateJWT);

// API Tạo đơn hàng mới
router.post("/", authorizeRole(["ADMIN", "SUPER_ADMIN"]), createOrder);

// API Lấy lịch sử mua hàng của 1 khách (để Frontend hiển thị ở chi tiết khách hàng)
router.get(
  "/customer/:id",
  authorizeRole(["ADMIN", "SUPER_ADMIN"]),
  getCustomerOrders,
);

// API Lấy danh sách toàn bộ hóa đơn
router.get(
  "/",
  authorizeRole(["ADMIN", "SUPER_ADMIN"]),
  getAllOrders,
);

export default router;
