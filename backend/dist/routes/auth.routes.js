"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Endpoint đăng nhập
router.post('/login', auth_controller_1.login);
// Endpoint refresh token
router.post('/refresh-token', auth_controller_1.refreshToken);
// Endpoint kiểm tra token (vd: lấy profile user)
router.get('/me', auth_middleware_1.authenticateJWT, (req, res) => {
    res.json({
        message: 'Profile retrieved successfully',
        user: req.user,
    });
});
// Endpoint ví dụ chỉ dành cho SUPER_ADMIN
router.get('/admin-only', auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorizeRole)(['SUPER_ADMIN']), (req, res) => {
    res.json({ message: 'Welcome Super Admin' });
});
exports.default = router;
