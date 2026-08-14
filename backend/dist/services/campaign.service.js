"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignService = exports.CampaignService = void 0;
const campaign_repository_1 = require("../repositories/campaign.repository");
const segment_service_1 = require("./segment.service");
const prisma_1 = __importDefault(require("../prisma"));
class CampaignService {
    getAllCampaigns() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield campaign_repository_1.campaignRepository.findAll();
        });
    }
    getCampaignById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const campaign = yield campaign_repository_1.campaignRepository.findById(Number(id));
            if (!campaign)
                throw new Error("Campaign not found");
            return campaign;
        });
    }
    createCampaign(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = {
                campaign_name: data.campaign_name,
                channel: data.channel || 'SMS',
                message_template: data.message_template,
                status: data.status || 'draft',
                scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : undefined,
            };
            if (data.segment_id) {
                input.segment = { connect: { segment_id: Number(data.segment_id) } };
            }
            return yield campaign_repository_1.campaignRepository.create(input);
        });
    }
    updateCampaign(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = {
                campaign_name: data.campaign_name,
                channel: data.channel,
                message_template: data.message_template,
                status: data.status,
                scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : undefined,
            };
            if (data.segment_id) {
                input.segment = { connect: { segment_id: Number(data.segment_id) } };
            }
            else if (data.segment_id === null) {
                input.segment = { disconnect: true };
            }
            return yield campaign_repository_1.campaignRepository.update(Number(id), input);
        });
    }
    deleteCampaign(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield campaign_repository_1.campaignRepository.delete(Number(id));
        });
    }
    sendCampaign(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const campaign = yield this.getCampaignById(id);
            if (!campaign)
                throw new Error("Campaign not found");
            if (campaign.status === 'sending' || campaign.status === 'sent') {
                throw new Error("Campaign is already sending or sent");
            }
            if (!campaign.segment_id)
                throw new Error("No target segment attached to this campaign");
            if (!campaign.message_template)
                throw new Error("No message template provided");
            // 1. Get customers from the segment
            const targetCustomers = yield segment_service_1.segmentService.getCustomersInSegment(campaign.segment_id.toString());
            if (targetCustomers.length === 0) {
                throw new Error("No customers match this segment's criteria");
            }
            // Filter valid phone numbers
            const validCustomers = targetCustomers.filter(c => c.phone_number);
            if (validCustomers.length === 0) {
                throw new Error("No customers with valid phone numbers found");
            }
            // 2. Create recipient records in DB
            const { smsQueue } = yield Promise.resolve().then(() => __importStar(require("./sms.queue")));
            const recipientsData = validCustomers.map((customer) => ({
                campaign_id: Number(id),
                customer_id: customer.customer_id,
                phone: customer.phone_number,
                status: "pending",
            }));
            yield prisma_1.default.campaignRecipient.createMany({
                data: recipientsData,
            });
            // 3. Get created recipients to queue them
            const recipients = yield prisma_1.default.campaignRecipient.findMany({
                where: {
                    campaign_id: Number(id),
                    status: "pending"
                }
            });
            // 4. Add to BullMQ
            for (const recipient of recipients) {
                const customer = validCustomers.find(c => c.customer_id === recipient.customer_id);
                const message = campaign.message_template
                    .replace(/{{name}}/g, (customer === null || customer === void 0 ? void 0 : customer.full_name) || 'Khách hàng')
                    .replace(/{{points}}/g, ((_a = customer === null || customer === void 0 ? void 0 : customer.total_points) === null || _a === void 0 ? void 0 : _a.toString()) || '0');
                yield smsQueue.add("send-sms", {
                    campaignId: Number(id),
                    recipientId: recipient.id,
                    phone: recipient.phone,
                    message,
                });
            }
            // 5. Update campaign status to 'sending'
            return yield campaign_repository_1.campaignRepository.update(Number(id), {
                status: 'sending'
            });
        });
    }
    getCampaignRecipients(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield prisma_1.default.campaignRecipient.findMany({
                where: { campaign_id: Number(id) },
                orderBy: { created_at: 'desc' },
                include: {
                    customer: {
                        select: {
                            full_name: true,
                            phone_number: true,
                        }
                    }
                }
            });
        });
    }
}
exports.CampaignService = CampaignService;
exports.campaignService = new CampaignService();
