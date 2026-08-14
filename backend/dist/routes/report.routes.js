"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const report_controller_1 = require("../controllers/report.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorizeRole)(["ADMIN", "SUPER_ADMIN"]));
router.get("/dashboard", report_controller_1.getDashboardReport);
exports.default = router;
