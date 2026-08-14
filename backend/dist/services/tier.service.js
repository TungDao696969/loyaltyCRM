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
exports.tierService = exports.TierService = void 0;
const tier_repository_1 = require("../repositories/tier.repository");
const customer_repository_1 = require("../repositories/customer.repository");
const prisma_1 = __importDefault(require("../prisma"));
class TierService {
    getAllTiers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield tier_repository_1.tierRepository.findAll();
        });
    }
    getTierById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tier = yield tier_repository_1.tierRepository.findById(Number(id));
            if (!tier)
                throw new Error("Tier not found");
            return tier;
        });
    }
    createTier(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = yield tier_repository_1.tierRepository.findByCode(data.tier_code);
            if (existing)
                throw new Error("Tier code already exists");
            return yield tier_repository_1.tierRepository.create({
                tier_code: data.tier_code,
                tier_name: data.tier_name,
                min_spent_amount: data.min_spent_amount,
                point_multiplier: data.point_multiplier,
                description: data.description,
            });
        });
    }
    updateTier(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const tier = yield tier_repository_1.tierRepository.findById(Number(id));
            if (!tier)
                throw new Error("Tier not found");
            if (data.tier_code && data.tier_code !== tier.tier_code) {
                const existing = yield tier_repository_1.tierRepository.findByCode(data.tier_code);
                if (existing)
                    throw new Error("Tier code already exists");
            }
            return yield tier_repository_1.tierRepository.update(Number(id), {
                tier_code: data.tier_code,
                tier_name: data.tier_name,
                min_spent_amount: data.min_spent_amount,
                point_multiplier: data.point_multiplier,
                description: data.description,
            });
        });
    }
    deleteTier(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tier = yield tier_repository_1.tierRepository.findById(Number(id));
            if (!tier)
                throw new Error("Tier not found");
            return yield tier_repository_1.tierRepository.delete(Number(id));
        });
    }
    /**
     * Đánh giá lại và tự động cập nhật hạng thành viên cho khách hàng dựa trên tổng chi tiêu
     * @param customerId ID của khách hàng
     * @returns Thông tin khách hàng đã được update hạng (nếu có)
     */
    evaluateCustomerTier(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const id = BigInt(customerId);
            // 1. Lấy khách hàng hiện tại
            const customer = yield customer_repository_1.customerRepository.findById(id);
            if (!customer) {
                throw new Error('Customer not found');
            }
            // 2. Lấy tất cả các hạng thành viên, sắp xếp min_spent_amount giảm dần (từ cao xuống thấp)
            const tiers = yield prisma_1.default.customerTier.findMany({
                orderBy: {
                    min_spent_amount: 'desc',
                },
            });
            if (tiers.length === 0)
                return customer;
            // 3. Tìm hạng thẻ cao nhất mà khách hàng thỏa mãn (total_spent >= min_spent_amount)
            let qualifiedTier = tiers[tiers.length - 1]; // Mặc định là hạng thấp nhất
            for (const tier of tiers) {
                if (Number(customer.total_spent) >= Number(tier.min_spent_amount)) {
                    qualifiedTier = tier;
                    break; // Vì đã xếp giảm dần, nên tìm thấy đầu tiên chính là cao nhất
                }
            }
            // 4. Nếu có sự thay đổi hạng, tiến hành cập nhật
            if (customer.current_tier_id !== qualifiedTier.tier_id) {
                const updatedCustomer = yield prisma_1.default.customer.update({
                    where: { customer_id: id },
                    data: { current_tier_id: qualifiedTier.tier_id },
                    include: { tier: true },
                });
                return updatedCustomer;
            }
            return customer;
        });
    }
}
exports.TierService = TierService;
exports.tierService = new TierService();
