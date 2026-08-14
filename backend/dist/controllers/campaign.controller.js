"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCampaignRecipients = exports.sendCampaign = exports.deleteCampaign = exports.updateCampaign = exports.createCampaign = exports.getCampaignById = exports.getCampaigns = void 0;
const campaign_service_1 = require("../services/campaign.service");
const getCampaigns = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaigns = yield campaign_service_1.campaignService.getAllCampaigns();
        res.status(200).json({ data: campaigns });
    }
    catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.getCampaigns = getCampaigns;
const getCampaignById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = yield campaign_service_1.campaignService.getCampaignById(req.params.id);
        res.status(200).json({ data: campaign });
    }
    catch (error) {
        res.status(404).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.getCampaignById = getCampaignById;
const createCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = yield campaign_service_1.campaignService.createCampaign(req.body);
        res.status(201).json({ message: "Campaign created", data: campaign });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.createCampaign = createCampaign;
const updateCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = yield campaign_service_1.campaignService.updateCampaign(req.params.id, req.body);
        res.status(200).json({ message: "Campaign updated", data: campaign });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.updateCampaign = updateCampaign;
const deleteCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield campaign_service_1.campaignService.deleteCampaign(req.params.id);
        res.status(200).json({ message: "Campaign deleted" });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.deleteCampaign = deleteCampaign;
const sendCampaign = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const campaign = yield campaign_service_1.campaignService.sendCampaign(req.params.id);
        res.status(200).json({ message: "Campaign sent successfully", data: campaign });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.sendCampaign = sendCampaign;
const getCampaignRecipients = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recipients = yield campaign_service_1.campaignService.getCampaignRecipients(req.params.id);
        res.status(200).json({ data: recipients });
    }
    catch (error) {
        res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
    }
});
exports.getCampaignRecipients = getCampaignRecipients;
