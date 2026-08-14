"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const store_controller_1 = require("../controllers/store.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Yêu cầu phải đăng nhập (token) và có quyền SUPER_ADMIN mới được thao tác với Store
router.use(auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorizeRole)(["SUPER_ADMIN"]));
router.post("/", store_controller_1.createStore);
router.get("/", store_controller_1.getStores);
router.get("/:id", store_controller_1.getStoreById);
router.put("/:id", store_controller_1.updateStore);
router.delete("/:id", store_controller_1.deleteStore);
router.put("/:id/restore", store_controller_1.restoreStore);
exports.default = router;
