"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const campaign_controller_1 = require("../controllers/campaign.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticateJWT, (0, auth_middleware_1.authorizeRole)(["ADMIN", "SUPER_ADMIN"]));
router.post("/:id/send", campaign_controller_1.sendCampaign); // Endpoint để gửi tin nhắn (SMS/Zalo)
router.get("/:id/recipients", campaign_controller_1.getCampaignRecipients);
router.post("/", campaign_controller_1.createCampaign);
router.get("/", campaign_controller_1.getCampaigns);
router.get("/:id", campaign_controller_1.getCampaignById);
router.put("/:id", campaign_controller_1.updateCampaign);
router.delete("/:id", campaign_controller_1.deleteCampaign);
exports.default = router;
