import { segmentRepository } from "../repositories/segment.repository";
import { Prisma } from "@prisma/client";
import prisma from "../prisma";

export class SegmentService {
  async getAllSegments() {
    return await segmentRepository.findAll();
  }

  async getSegmentById(id: string) {
    const segment = await segmentRepository.findById(Number(id));
    if (!segment) throw new Error("Segment not found");
    return segment;
  }

  async createSegment(data: any) {
    return await segmentRepository.create({
      segment_name: data.segment_name,
      rfm_criteria: data.rfm_criteria,
    });
  }

  async updateSegment(id: string, data: any) {
    return await segmentRepository.update(Number(id), {
      segment_name: data.segment_name,
      rfm_criteria: data.rfm_criteria,
    });
  }

  async deleteSegment(id: string) {
    return await segmentRepository.delete(Number(id));
  }

  // Lọc danh sách khách hàng thuộc Segment (RFM Matching)
  async getCustomersInSegment(segmentId: string) {
    const segment = await this.getSegmentById(segmentId);
    if (!segment.rfm_criteria) return [];

    const criteria = segment.rfm_criteria as any; // { minR, maxR, minF, maxF, minM, maxM }

    // Fetch tất cả khách hàng cùng giao dịch của họ
    const customers = await prisma.customer.findMany({
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
      if (criteria.minM !== undefined && mValue < Number(criteria.minM)) mMatch = false;
      if (criteria.maxM !== undefined && mValue > Number(criteria.maxM)) mMatch = false;

      // F (Frequency)
      const fValue = c.transactions.length;
      let fMatch = true;
      if (criteria.minF !== undefined && fValue < Number(criteria.minF)) fMatch = false;
      if (criteria.maxF !== undefined && fValue > Number(criteria.maxF)) fMatch = false;

      // R (Recency): Số ngày kể từ giao dịch cuối cùng
      let rValue = 999999; // Default if no transaction
      if (c.transactions.length > 0 && c.transactions[0].created_at) {
        const lastTxDate = new Date(c.transactions[0].created_at);
        const diffTime = Math.abs(now.getTime() - lastTxDate.getTime());
        rValue = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      }
      let rMatch = true;
      if (criteria.minR !== undefined && rValue < Number(criteria.minR)) rMatch = false;
      if (criteria.maxR !== undefined && rValue > Number(criteria.maxR)) rMatch = false;

      // Nếu thỏa mãn toàn bộ RFM
      if (mMatch && fMatch && rMatch) {
        matchedCustomers.push(c);
      }
    }

    return matchedCustomers;
  }
}

export const segmentService = new SegmentService();
