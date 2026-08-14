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
exports.customerRepository = exports.CustomerRepository = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class CustomerRepository {
    findAll(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            // Khởi tạo điều kiện mặc định
            const whereCondition = {
                is_deleted: (filters === null || filters === void 0 ? void 0 : filters.is_deleted) || false,
            };
            // Tìm theo Email
            if (filters === null || filters === void 0 ? void 0 : filters.email) {
                whereCondition.email = { contains: filters.email, mode: "insensitive" };
            }
            // Tìm theo tên
            if (filters === null || filters === void 0 ? void 0 : filters.full_name) {
                whereCondition.full_name = {
                    contains: filters.full_name,
                    mode: "insensitive",
                };
            }
            // Tìm chính xác theo Customer ID
            if (filters === null || filters === void 0 ? void 0 : filters.customer_id) {
                whereCondition.customer_id = BigInt(filters.customer_id);
            }
            // 4. Lọc theo trạng thái (Active/Inactive)
            if (filters === null || filters === void 0 ? void 0 : filters.status) {
                whereCondition.status = filters.status;
            }
            // Lọc theo phân loại khách hàng
            if (filters === null || filters === void 0 ? void 0 : filters.segment_id) {
                whereCondition.segments = {
                    some: {
                        segment_id: Number(filters.segment_id), // Nhớ check kiểu dữ liệu của segment_id trong schema, dùng Number hoặc BigInt tùy DB của bạn
                    },
                };
            }
            return prisma_1.default.customer.findMany({
                where: whereCondition,
                orderBy: { created_at: "desc" },
                include: {
                    tier: true,
                },
            });
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.customer.findUnique({
                where: { customer_id: id },
                include: {
                    tier: true,
                    vouchers: {
                        where: { status: "active" },
                        orderBy: { expired_at: "asc" }
                    }
                },
            });
        });
    }
    findByPhone(phone) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.customer.findUnique({
                where: { phone_number: phone },
                include: {
                    tier: true,
                    vouchers: {
                        where: { status: "active" },
                        orderBy: { expired_at: "asc" }
                    }
                },
            });
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.customer.create({
                data,
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.customer.update({
                where: { customer_id: id },
                data,
            });
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.customer.update({
                where: { customer_id: id },
                data: { is_deleted: true },
            });
        });
    }
    restore(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.customer.update({
                where: { customer_id: id },
                data: { is_deleted: false },
            });
        });
    }
}
exports.CustomerRepository = CustomerRepository;
exports.customerRepository = new CustomerRepository();
