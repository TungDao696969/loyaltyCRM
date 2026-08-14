import prisma from "../prisma";
import { Prisma, Order } from "@prisma/client";

export class OrderRepository {
  async findByCustomerId(customerId: bigint): Promise<any[]> {
    return prisma.order.findMany({
      where: { customer_id: customerId },
      include: { items: true }, // Trả về kèm chi tiết các món hàng
      orderBy: { created_at: "desc" },
    });
  }

  async findAll(): Promise<any[]> {
    return prisma.order.findMany({
      include: { 
        items: true,
        customer: true // get customer info for the orders page
      },
      orderBy: { created_at: "desc" },
    });
  }
}

export const orderRepository = new OrderRepository();
