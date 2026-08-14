import { Router } from "express";
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  updateCampaign,
  deleteCampaign,
  sendCampaign,
  getCampaignRecipients
} from "../controllers/campaign.controller";
import { authenticateJWT, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

router.use(authenticateJWT, authorizeRole(["ADMIN", "SUPER_ADMIN"]));

router.post("/:id/send", sendCampaign); // Endpoint để gửi tin nhắn (SMS/Zalo)
router.get("/:id/recipients", getCampaignRecipients);

router.post("/", createCampaign);
router.get("/", getCampaigns);
router.get("/:id", getCampaignById);
router.put("/:id", updateCampaign);
router.delete("/:id", deleteCampaign);

export default router;
