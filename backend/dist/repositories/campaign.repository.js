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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignRepository = exports.CampaignRepository = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class CampaignRepository {
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.campaign.findMany({
                include: { segment: true },
                orderBy: { campaign_id: "desc" },
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.campaign.findUnique({
                where: { campaign_id: id },
                include: { segment: true },
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.campaign.create({
                data,
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.campaign.update({
                where: { campaign_id: id },
                data,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.campaign.delete({
                where: { campaign_id: id },
            });
        });
    }
}
exports.CampaignRepository = CampaignRepository;
exports.campaignRepository = new CampaignRepository();
