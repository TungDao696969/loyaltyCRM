import prisma from "../prisma";
import { Prisma, PointTransaction } from "@prisma/client";

export class TransactionRepository {
  async findAll(): Promise<PointTransaction[]> {
    return prisma.pointTransaction.findMany({
      orderBy: { created_at: "desc" },
      include: {
        customer: true,
        store: true
      }
    });
  }

  async findById(id: bigint): Promise<PointTransaction | null> {
    return prisma.pointTransaction.findUnique({
      where: { transaction_id: id },
      include: {
        customer: true,
        store: true
      }
    });
  }

  async findByCustomerId(customerId: bigint): Promise<PointTransaction[]> {
    return prisma.pointTransaction.findMany({
      where: { customer_id: customerId },
      orderBy: { created_at: "desc" },
      include: {
        store: true,
        customer: false
      }
    });
  }

  async create(data: Prisma.PointTransactionCreateInput): Promise<PointTransaction> {
    return prisma.pointTransaction.create({
      data,
    });
  }

  async update(id: bigint, data: Prisma.PointTransactionUpdateInput): Promise<PointTransaction> {
    return prisma.pointTransaction.update({
      where: { transaction_id: id },
      data,
    });
  }

  async delete(id: bigint): Promise<PointTransaction> {
    return prisma.pointTransaction.delete({
      where: { transaction_id: id },
    });
  }
}

export const transactionRepository = new TransactionRepository();
