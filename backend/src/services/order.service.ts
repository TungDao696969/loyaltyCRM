import { orderRepository } from "../repositories/order.repository";
import { Prisma } from "@prisma/client";
import prisma from "../prisma";
import { tierService } from "./tier.service"; // Nếu bạn cần gọi service để update hạng

export class OrderService {
  async getCustomerOrders(customerId: string) {
    return await orderRepository.findByCustomerId(BigInt(customerId));
  }

  async getAllOrders() {
    return await orderRepository.findAll();
  }

  async createOrder(data: any) {
    const customerId = BigInt(data.customer_id);

    return await prisma.$transaction(async (tx) => {
      // 1. Tính tổng tiền tự động từ chi tiết hàng hóa
      const totalAmount = data.items.reduce(
        (sum: number, item: any) => sum + item.quantity * item.price,
        0,
      );

      // 2. Tạo hóa đơn & chi tiết hóa đơn (Nested Writes)
      const orderData: Prisma.OrderCreateInput = {
        customer: { connect: { customer_id: customerId } },
        invoice_code: data.invoice_code || `INV-${Date.now()}`,
        total_amount: totalAmount,
        status: data.status || "completed",
        items: {
          create: data.items.map((item: any) => ({
            product_name: item.product_name,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.quantity * item.price,
          })),
        },
      };

      const newOrder = await tx.order.create({
        data: orderData,
        include: { items: true },
      });

      return newOrder;
    });
  }
}

export const orderService = new OrderService();
