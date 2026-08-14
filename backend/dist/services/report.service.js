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
exports.reportService = exports.ReportService = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class ReportService {
    getDashboardReport() {
        return __awaiter(this, void 0, void 0, function* () {
            // 1. Customer Analytics
            const totalCustomers = yield prisma_1.default.customer.count({
                where: { is_deleted: false }
            });
            const activeCustomers = yield prisma_1.default.customer.count({
                where: { is_deleted: false, status: 'active' }
            });
            const tiersData = yield prisma_1.default.customer.groupBy({
                by: ['current_tier_id'],
                _count: {
                    customer_id: true,
                },
            });
            const allTiers = yield prisma_1.default.customerTier.findMany();
            const tierDistribution = tiersData.map(t => {
                const tierInfo = allTiers.find(tier => tier.tier_id === t.current_tier_id);
                return {
                    name: tierInfo ? tierInfo.tier_name : 'No Tier',
                    value: t._count.customer_id
                };
            });
            // 2. Points Analytics
            const pointTransactions = yield prisma_1.default.pointTransaction.findMany();
            let totalEarned = 0;
            let totalRedeemed = 0;
            pointTransactions.forEach(tx => {
                if (tx.transaction_type === 'EARN') {
                    totalEarned += Number(tx.points);
                }
                else if (tx.transaction_type === 'REDEEM') {
                    totalRedeemed += Number(tx.points);
                }
            });
            // 3. Campaign Reports
            const totalCampaigns = yield prisma_1.default.campaign.count();
            const sentCampaigns = yield prisma_1.default.campaign.count({
                where: { status: 'sent' }
            });
            // 4. Store Performance (Top 5 by Transaction count)
            const storeTransactions = yield prisma_1.default.pointTransaction.groupBy({
                by: ['store_id'],
                _count: {
                    transaction_id: true
                },
                _sum: {
                    order_amount: true
                },
                orderBy: {
                    _sum: {
                        order_amount: 'desc'
                    }
                },
                take: 5
            });
            const allStores = yield prisma_1.default.store.findMany();
            const storePerformance = storeTransactions.map(st => {
                const storeInfo = allStores.find(s => s.id === st.store_id);
                return {
                    store_name: storeInfo ? storeInfo.storeName : 'Unknown Store',
                    transaction_count: st._count.transaction_id,
                    total_revenue: Number(st._sum.order_amount || 0)
                };
            });
            return {
                customers: {
                    total: totalCustomers,
                    active: activeCustomers,
                    tier_distribution: tierDistribution
                },
                points: {
                    total_earned: totalEarned,
                    total_redeemed: totalRedeemed,
                    outstanding: totalEarned - totalRedeemed
                },
                campaigns: {
                    total: totalCampaigns,
                    sent: sentCampaigns
                },
                stores: {
                    top_performers: storePerformance
                }
            };
        });
    }
}
exports.ReportService = ReportService;
exports.reportService = new ReportService();
