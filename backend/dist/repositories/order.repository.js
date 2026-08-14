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
exports.orderRepository = exports.OrderRepository = void 0;
const prisma_1 = __importDefault(require("../prisma"));
class OrderRepository {
    findByCustomerId(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.order.findMany({
                where: { customer_id: customerId },
                include: { items: true }, // Trả về kèm chi tiết các món hàng
                orderBy: { created_at: "desc" },
            });
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return prisma_1.default.order.findMany({
                include: {
                    items: true,
                    customer: true // get customer info for the orders page
                },
                orderBy: { created_at: "desc" },
            });
        });
    }
}
exports.OrderRepository = OrderRepository;
exports.orderRepository = new OrderRepository();
