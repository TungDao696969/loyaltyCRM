import prisma from "../prisma";
import { Prisma, CustomerTier } from "@prisma/client";

export class TierRepository {
  async findAll(): Promise<CustomerTier[]> {
    return prisma.customerTier.findMany({
      orderBy: { min_spent_amount: "asc" },
    });
  }

  async findById(id: number): Promise<CustomerTier | null> {
    return prisma.customerTier.findUnique({
      where: { tier_id: id },
    });
  }

  async findByCode(code: string): Promise<CustomerTier | null> {
    return prisma.customerTier.findUnique({
      where: { tier_code: code },
    });
  }

  async create(data: Prisma.CustomerTierCreateInput): Promise<CustomerTier> {
    return prisma.customerTier.create({
      data,
    });
  }

  async update(id: number, data: Prisma.CustomerTierUpdateInput): Promise<CustomerTier> {
    return prisma.customerTier.update({
      where: { tier_id: id },
      data,
    });
  }

  async delete(id: number): Promise<CustomerTier> {
    return prisma.customerTier.delete({
      where: { tier_id: id },
    });
  }
}

export const tierRepository = new TierRepository();
