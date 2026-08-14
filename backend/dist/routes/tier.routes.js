"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tier_controller_1 = require("../controllers/tier.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
// Protect all routes with JWT and roles
router.use(auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorizeRole)(["ADMIN", "SUPER_ADMIN"]));
router.post("/", tier_controller_1.createTier);
router.get("/", tier_controller_1.getTiers);
router.get("/:id", tier_controller_1.getTierById);
router.put('/:id', tier_controller_1.updateTier);
router.delete('/:id', tier_controller_1.deleteTier);
exports.default = router;
