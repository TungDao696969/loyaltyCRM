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
exports.voucherService = exports.VoucherService = void 0;
const voucher_repository_1 = require("../repositories/voucher.repository");
const customer_repository_1 = require("../repositories/customer.repository");
const transaction_repository_1 = require("../repositories/transaction.repository");
const prisma_1 = __importDefault(require("../prisma"));
class VoucherService {
    getAllVouchers() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield voucher_repository_1.voucherRepository.findAll();
        });
    }
    getVoucherById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const voucher = yield voucher_repository_1.voucherRepository.findById(BigInt(id));
            if (!voucher) {
                throw new Error("Voucher not found");
            }
            return voucher;
        });
    }
    getVoucherByCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const voucher = yield voucher_repository_1.voucherRepository.findByCode(code);
            if (!voucher) {
                throw new Error("Voucher not found");
            }
            return voucher;
        });
    }
    createVoucher(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Tự động sinh mã voucher nếu không có
            let voucherCode = data.voucher_code;
            if (!voucherCode) {
                const generateCode = () => 'VOUCHER-' + Math.random().toString(36).substring(2, 8).toUpperCase();
                voucherCode = generateCode();
                // Ensure unique
                let existing = yield voucher_repository_1.voucherRepository.findByCode(voucherCode);
                while (existing) {
                    voucherCode = generateCode();
                    existing = yield voucher_repository_1.voucherRepository.findByCode(voucherCode);
                }
            }
            else {
                const existing = yield voucher_repository_1.voucherRepository.findByCode(voucherCode);
                if (existing) {
                    throw new Error("Voucher code already exists");
                }
            }
            const voucherInput = {
                voucher_code: voucherCode,
                voucher_type: data.voucher_type || "FIXED",
                discount_value: data.discount_value,
                max_discount: data.max_discount,
                min_order_value: data.min_order_value,
                status: data.status || "active",
                expired_at: data.expired_at ? new Date(data.expired_at) : undefined,
            };
            if (data.campaign_id) {
                voucherInput.campaign = { connect: { campaign_id: Number(data.campaign_id) } };
            }
            if (data.customer_id) {
                voucherInput.customer = {
                    connect: { customer_id: BigInt(data.customer_id) }
                };
            }
            return yield voucher_repository_1.voucherRepository.create(voucherInput);
        });
    }
    updateVoucher(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const voucher = yield voucher_repository_1.voucherRepository.findById(BigInt(id));
            if (!voucher) {
                throw new Error("Voucher not found");
            }
            if (data.voucher_code && data.voucher_code !== voucher.voucher_code) {
                const existing = yield voucher_repository_1.voucherRepository.findByCode(data.voucher_code);
                if (existing) {
                    throw new Error("Voucher code already exists");
                }
            }
            const updateInput = {
                voucher_code: data.voucher_code,
                voucher_type: data.voucher_type,
                discount_value: data.discount_value,
                max_discount: data.max_discount,
                min_order_value: data.min_order_value,
                status: data.status,
                expired_at: data.expired_at ? new Date(data.expired_at) : undefined,
            };
            if (data.campaign_id) {
                updateInput.campaign = { connect: { campaign_id: Number(data.campaign_id) } };
            }
            else if (data.campaign_id === null) {
                updateInput.campaign = { disconnect: true };
            }
            if (data.customer_id) {
                updateInput.customer = {
                    connect: { customer_id: BigInt(data.customer_id) }
                };
            }
            else if (data.customer_id === null) {
                updateInput.customer = { disconnect: true };
            }
            return yield voucher_repository_1.voucherRepository.update(BigInt(id), updateInput);
        });
    }
    deleteVoucher(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const voucherId = BigInt(id);
            yield this.getVoucherById(id);
            return yield voucher_repository_1.voucherRepository.delete(voucherId);
        });
    }
    applyVoucher(code, customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const voucher = yield voucher_repository_1.voucherRepository.findByCode(code);
            if (!voucher) {
                throw new Error("Voucher not found");
            }
            if (voucher.status !== "active") {
                throw new Error(`Voucher is ${voucher.status}`);
            }
            if (voucher.expired_at && new Date() > voucher.expired_at) {
                throw new Error("Voucher has expired");
            }
            if (voucher.customer_id && customerId && voucher.customer_id !== BigInt(customerId)) {
                throw new Error("Voucher does not belong to this customer");
            }
            // Mark as used
            return yield voucher_repository_1.voucherRepository.update(voucher.voucher_id, {
                status: "used",
                used_at: new Date()
            });
        });
    }
    checkVoucher(code, customerId, orderAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            const voucher = yield voucher_repository_1.voucherRepository.findByCode(code);
            if (!voucher) {
                throw new Error("Voucher not found");
            }
            if (voucher.status !== "active") {
                throw new Error(`Voucher is ${voucher.status}`);
            }
            if (voucher.expired_at && new Date() > voucher.expired_at) {
                throw new Error("Voucher has expired");
            }
            if (voucher.customer_id && customerId && voucher.customer_id !== BigInt(customerId)) {
                throw new Error("Voucher does not belong to this customer");
            }
            if (orderAmount !== undefined && voucher.min_order_value && orderAmount < Number(voucher.min_order_value)) {
                throw new Error(`Order amount must be at least ${Number(voucher.min_order_value)} to use this voucher`);
            }
            return voucher;
        });
    }
    exchangePointsForVoucher(customerId, rewardId) {
        return __awaiter(this, void 0, void 0, function* () {
            const reward = yield prisma_1.default.rewardCatalog.findUnique({
                where: { reward_id: Number(rewardId) }
            });
            if (!reward || !reward.is_active) {
                throw new Error("Reward not found or inactive");
            }
            const pointsToExchange = reward.required_points;
            if (pointsToExchange <= 0) {
                throw new Error("Points to exchange must be greater than 0");
            }
            const customer = yield customer_repository_1.customerRepository.findById(BigInt(customerId));
            if (!customer) {
                throw new Error("Customer not found");
            }
            if (customer.total_points < pointsToExchange) {
                throw new Error(`Customer only has ${customer.total_points} points. Not enough to exchange ${pointsToExchange} points.`);
            }
            // Deduct points
            const newBalance = customer.total_points - pointsToExchange;
            yield customer_repository_1.customerRepository.update(BigInt(customerId), {
                total_points: newBalance
            });
            // Log the transaction
            yield transaction_repository_1.transactionRepository.create({
                customer: { connect: { customer_id: BigInt(customerId) } },
                pos_invoice_code: `EXCHANGE-${Date.now()}`,
                transaction_type: 'REDEEM',
                order_amount: 0,
                points: pointsToExchange,
                balance_after: newBalance,
                is_offline_sync: false
            });
            const discountValue = reward.voucher_discount_value || 0;
            const generateCode = () => 'EXC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            let voucherCode = generateCode();
            let existing = yield voucher_repository_1.voucherRepository.findByCode(voucherCode);
            while (existing) {
                voucherCode = generateCode();
                existing = yield voucher_repository_1.voucherRepository.findByCode(voucherCode);
            }
            // Expires in 30 days
            const expiredAt = new Date();
            expiredAt.setDate(expiredAt.getDate() + 30);
            return yield voucher_repository_1.voucherRepository.create({
                voucher_code: voucherCode,
                voucher_type: reward.reward_type === 'VOUCHER' ? 'FIXED' : 'GIFT',
                discount_value: discountValue,
                status: 'active',
                expired_at: expiredAt,
                customer: { connect: { customer_id: BigInt(customerId) } }
            });
        });
    }
}
exports.VoucherService = VoucherService;
exports.voucherService = new VoucherService();
