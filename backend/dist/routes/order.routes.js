"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controllers/order.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Yêu cầu đăng nhập mới được gọi
router.use(auth_middleware_1.authenticateJWT);
// API Tạo đơn hàng mới
router.post("/", (0, auth_middleware_1.authorizeRole)(["ADMIN", "SUPER_ADMIN"]), order_controller_1.createOrder);
// API Lấy lịch sử mua hàng của 1 khách (để Frontend hiển thị ở chi tiết khách hàng)
router.get("/customer/:id", (0, auth_middleware_1.authorizeRole)(["ADMIN", "SUPER_ADMIN"]), order_controller_1.getCustomerOrders);
// API Lấy danh sách toàn bộ hóa đơn
router.get("/", (0, auth_middleware_1.authorizeRole)(["ADMIN", "SUPER_ADMIN"]), order_controller_1.getAllOrders);
exports.default = router;
