"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const segment_controller_1 = require("../controllers/segment.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorizeRole)(["ADMIN", "SUPER_ADMIN"]));
router.get("/:id/customers", segment_controller_1.getSegmentCustomers); // Get customers matching the RFM
router.post("/", segment_controller_1.createSegment);
router.get("/", segment_controller_1.getSegments);
router.get("/:id", segment_controller_1.getSegmentById);
router.put("/:id", segment_controller_1.updateSegment);
router.delete("/:id", segment_controller_1.deleteSegment);
exports.default = router;
