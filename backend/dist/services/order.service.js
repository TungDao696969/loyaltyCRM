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
exports.orderService = exports.OrderService = void 0;
const order_repository_1 = require("../repositories/order.repository");
const prisma_1 = __importDefault(require("../prisma"));
class OrderService {
    getCustomerOrders(customerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_repository_1.orderRepository.findByCustomerId(BigInt(customerId));
        });
    }
    getAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield order_repository_1.orderRepository.findAll();
        });
    }
    createOrder(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const customerId = BigInt(data.customer_id);
            return yield prisma_1.default.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // 1. Tính tổng tiền tự động từ chi tiết hàng hóa
                const totalAmount = data.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
                // 2. Tạo hóa đơn & chi tiết hóa đơn (Nested Writes)
                const orderData = {
                    customer: { connect: { customer_id: customerId } },
                    invoice_code: data.invoice_code || `INV-${Date.now()}`,
                    total_amount: totalAmount,
                    status: data.status || "completed",
                    items: {
                        create: data.items.map((item) => ({
                            product_name: item.product_name,
                            quantity: item.quantity,
                            price: item.price,
                            subtotal: item.quantity * item.price,
                        })),
                    },
                };
                const newOrder = yield tx.order.create({
                    data: orderData,
                    include: { items: true },
                });
                return newOrder;
            }));
        });
    }
}
exports.OrderService = OrderService;
exports.orderService = new OrderService();
