import prisma from "../prisma";
import { Prisma, CustomerSegment } from "@prisma/client";

export class SegmentRepository {
  async findAll(): Promise<CustomerSegment[]> {
    return prisma.customerSegment.findMany({
      orderBy: { created_at: "desc" },
    });
  }

  async findById(id: number): Promise<CustomerSegment | null> {
    return prisma.customerSegment.findUnique({
      where: { segment_id: id },
    });
  }

  async create(data: Prisma.CustomerSegmentCreateInput): Promise<CustomerSegment> {
    return prisma.customerSegment.create({
      data,
    });
  }

  async update(id: number, data: Prisma.CustomerSegmentUpdateInput): Promise<CustomerSegment> {
    return prisma.customerSegment.update({
      where: { segment_id: id },
      data,
    });
  }

  async delete(id: number): Promise<CustomerSegment> {
    return prisma.customerSegment.delete({
      where: { segment_id: id },
    });
  }
}

export const segmentRepository = new SegmentRepository();
