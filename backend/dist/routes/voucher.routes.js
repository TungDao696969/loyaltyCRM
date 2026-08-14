"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const voucher_controller_1 = require("../controllers/voucher.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/rewards/catalog", auth_middleware_1.authenticateJWT, voucher_controller_1.getRewards);
router.post("/apply", auth_middleware_1.authenticateJWT, voucher_controller_1.applyVoucher);
router.post("/check", auth_middleware_1.authenticateJWT, voucher_controller_1.checkVoucher);
router.post("/exchange", auth_middleware_1.authenticateJWT, voucher_controller_1.exchangeVoucher);
// Phân quyền CRUD cơ bản cho ADMIN và SUPER_ADMIN
router.use(auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorizeRole)(["ADMIN", "SUPER_ADMIN"]));
router.post("/", voucher_controller_1.createVoucher);
router.get("/", voucher_controller_1.getVouchers);
router.get("/:id", voucher_controller_1.getVoucherById);
router.put('/:id', voucher_controller_1.updateVoucher);
router.delete('/:id', voucher_controller_1.deleteVoucher);
exports.default = router;
