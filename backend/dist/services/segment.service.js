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
exports.segmentService = exports.SegmentService = void 0;
const segment_repository_1 = require("../repositories/segment.repository");
const prisma_1 = __importDefault(require("../prisma"));
class SegmentService {
    getAllSegments() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield segment_repository_1.segmentRepository.findAll();
        });
    }
    getSegmentById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const segment = yield segment_repository_1.segmentRepository.findById(Number(id));
            if (!segment)
                throw new Error("Segment not found");
            return segment;
        });
    }
    createSegment(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield segment_repository_1.segmentRepository.create({
                segment_name: data.segment_name,
                rfm_criteria: data.rfm_criteria,
            });
        });
    }
    updateSegment(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield segment_repository_1.segmentRepository.update(Number(id), {
                segment_name: data.segment_name,
                rfm_criteria: data.rfm_criteria,
            });
        });
    }
    deleteSegment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield segment_repository_1.segmentRepository.delete(Number(id));
        });
    }
    // Lọc danh sách khách hàng thuộc Segment (RFM Matching)
    getCustomersInSegment(segmentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const segment = yield this.getSegmentById(segmentId);
            if (!segment.rfm_criteria)
                return [];
            const criteria = segment.rfm_criteria; // { minR, maxR, minF, maxF, minM, maxM }
            // Fetch tất cả khách hàng cùng giao dịch của họ
            const customers = yield prisma_1.default.customer.findMany({
                where: { is_deleted: false, status: 'active' },
                include: {
                    transactions: {
                        orderBy: { created_at: 'desc' }
                    }
                }
            });
            const matchedCustomers = [];
            const now = new Date();
            for (const c of customers) {
                // M (Monetary)
                const mValue = Number(c.total_spent || 0);
                let mMatch = true;
                if (criteria.minM !== undefined && mValue < Number(criteria.minM))
                    mMatch = false;
                if (criteria.maxM !== undefined && mValue > Number(criteria.maxM))
                    mMatch = false;
                // F (Frequency)
                const fValue = c.transactions.length;
                let fMatch = true;
                if (criteria.minF !== undefined && fValue < Number(criteria.minF))
                    fMatch = false;
                if (criteria.maxF !== undefined && fValue > Number(criteria.maxF))
                    fMatch = false;
                // R (Recency): Số ngày kể từ giao dịch cuối cùng
                let rValue = 999999; // Default if no transaction
                if (c.transactions.length > 0 && c.transactions[0].created_at) {
                    const lastTxDate = new Date(c.transactions[0].created_at);
                    const diffTime = Math.abs(now.getTime() - lastTxDate.getTime());
                    rValue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                }
                let rMatch = true;
                if (criteria.minR !== undefined && rValue < Number(criteria.minR))
                    rMatch = false;
                if (criteria.maxR !== undefined && rValue > Number(criteria.maxR))
                    rMatch = false;
                // Nếu thỏa mãn toàn bộ RFM
                if (mMatch && fMatch && rMatch) {
                    matchedCustomers.push(c);
                }
            }
            return matchedCustomers;
        });
    }
}
exports.SegmentService = SegmentService;
exports.segmentService = new SegmentService();
