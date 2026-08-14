import prisma from "../prisma";
import { Prisma, Voucher } from "@prisma/client";

export class VoucherRepository {
  async findAll(): Promise<Voucher[]> {
    return prisma.voucher.findMany({
      orderBy: { expired_at: "desc" },
      include: {
        customer: true // Include customer details if assigned
      }
    });
  }

  async findById(id: bigint): Promise<Voucher | null> {
    return prisma.voucher.findUnique({
      where: { voucher_id: id },
      include: {
        customer: true
      }
    });
  }

  async findByCode(code: string): Promise<Voucher | null> {
    return prisma.voucher.findUnique({
      where: { voucher_code: code },
      include: {
        customer: true
      }
    });
  }

  async create(data: Prisma.VoucherCreateInput): Promise<Voucher> {
    return prisma.voucher.create({
      data,
    });
  }

  async update(
    id: bigint,
    data: Prisma.VoucherUpdateInput,
  ): Promise<Voucher> {
    return prisma.voucher.update({
      where: { voucher_id: id },
      data,
    });
  }

  async delete(id: bigint): Promise<Voucher> {
    return prisma.voucher.delete({
      where: { voucher_id: id },
    });
  }
}

export const voucherRepository = new VoucherRepository();
