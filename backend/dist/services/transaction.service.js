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
exports.transactionService = exports.TransactionService = void 0;
const transaction_repository_1 = require("../repositories/transaction.repository");
const customer_repository_1 = require("../repositories/customer.repository");
const tier_service_1 = require("./tier.service");
const voucher_service_1 = require("./voucher.service");
const prisma_1 = __importDefault(require("../prisma"));
class TransactionService {
    getAllTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield transaction_repository_1.transactionRepository.findAll();
        });
    }
    getTransactionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield transaction_repository_1.transactionRepository.findById(BigInt(id));
            if (!transaction)
                throw new Error("Transaction not found");
            return transaction;
        });
    }
    getTransactionsByCustomerId(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield transaction_repository_1.transactionRepository.findByCustomerId(BigInt(customerId));
        });
    }
    createTransaction(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // Basic fields
            const originalOrderAmount = Number(data.order_amount || 0);
            let orderAmount = originalOrderAmount;
            let appliedVoucher = null;
            if (data.voucher_code && data.customer_id) {
                appliedVoucher = yield voucher_service_1.voucherService.checkVoucher(data.voucher_code, data.customer_id, originalOrderAmount);
                let discount = Number(appliedVoucher.discount_value);
                if (appliedVoucher.voucher_type === 'PERCENTAGE') {
                    discount = (originalOrderAmount * discount) / 100;
                    if (appliedVoucher.max_discount && discount > Number(appliedVoucher.max_discount)) {
                        discount = Number(appliedVoucher.max_discount);
                    }
                }
                orderAmount = Math.max(0, originalOrderAmount - discount);
            }
            let points = Number(data.points || 0);
            const transactionType = data.transaction_type || 'EARN'; // EARN or REDEEM
            let balanceAfter = 0;
            const posInvoiceCode = data.pos_invoice_code || `INV-${Date.now()}`;
            let transactionInput = {
                pos_invoice_code: posInvoiceCode,
                transaction_type: transactionType,
                order_amount: orderAmount,
                points: points,
                balance_after: 0,
                is_offline_sync: data.is_offline_sync || false,
            };
            if (data.store_id) {
                transactionInput.store = { connect: { id: Number(data.store_id) } };
            }
            if (data.customer_id) {
                const customer = yield customer_repository_1.customerRepository.findById(BigInt(data.customer_id));
                if (!customer)
                    throw new Error("Customer not found");
                if (transactionType === 'REDEEM') {
                    if (customer.total_points < points) {
                        throw new Error("Not enough points to redeem");
                    }
                    balanceAfter = customer.total_points - points;
                }
                else {
                    // EARN points: Auto-calculate if not explicitly provided or if provided as 0
                    if (points === 0 && orderAmount > 0) {
                        // 1. Get active loyalty rule
                        const activeRule = yield prisma_1.default.loyaltyRule.findFirst({
                            where: { is_active: true, rule_type: 'EARN' },
                            orderBy: { start_date: 'desc' }
                        });
                        // Default conversion rate: 10,000 VND = 1 point
                        const conversionRate = activeRule ? Number(activeRule.conversion_rate) : 10000;
                        let basePoints = 0;
                        if (conversionRate > 0) {
                            // For example, orderAmount = 50000, conversionRate = 10000 => basePoints = 5.
                            // If conversionRate is e.g. 0.0001, we might need to multiply.
                            // Usually conversion_rate is stored as 10000. Let's assume orderAmount / conversionRate.
                            basePoints = Math.floor(orderAmount / conversionRate);
                        }
                        // 2. Get customer tier point multiplier
                        let multiplier = 1.0;
                        if (customer.tier) {
                            multiplier = Number(customer.tier.point_multiplier);
                        }
                        points = Math.floor(basePoints * multiplier);
                    }
                    balanceAfter = customer.total_points + points;
                }
                transactionInput.points = points;
                transactionInput.balance_after = balanceAfter;
                transactionInput.customer = { connect: { customer_id: BigInt(data.customer_id) } };
                // Update customer total points and total spent
                yield customer_repository_1.customerRepository.update(BigInt(data.customer_id), {
                    total_points: balanceAfter,
                    total_spent: Number(customer.total_spent) + orderAmount
                });
                // Auto evaluate tier after transaction
                yield tier_service_1.tierService.evaluateCustomerTier(data.customer_id);
            }
            else {
                transactionInput.balance_after = 0;
            }
            const transaction = yield transaction_repository_1.transactionRepository.create(transactionInput);
            if (appliedVoucher) {
                yield voucher_service_1.voucherService.applyVoucher(data.voucher_code, data.customer_id);
            }
            return transaction;
        });
    }
    // Edit and Delete are provided for full CRUD assignment requirements, 
    // though typically restricted in real systems
    updateTransaction(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield transaction_repository_1.transactionRepository.update(BigInt(id), {
                pos_invoice_code: data.pos_invoice_code,
                transaction_type: data.transaction_type,
                order_amount: data.order_amount,
                points: data.points,
            });
        });
    }
    deleteTransaction(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield transaction_repository_1.transactionRepository.delete(BigInt(id));
        });
    }
}
exports.TransactionService = TransactionService;
exports.transactionService = new TransactionService();
