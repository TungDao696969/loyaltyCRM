import { tierRepository } from '../repositories/tier.repository';
import { customerRepository } from '../repositories/customer.repository';
import prisma from '../prisma';

export class TierService {
  async getAllTiers() {
    return await tierRepository.findAll();
  }

  async getTierById(id: string) {
    const tier = await tierRepository.findById(Number(id));
    if (!tier) throw new Error("Tier not found");
    return tier;
  }

  async createTier(data: any) {
    const existing = await tierRepository.findByCode(data.tier_code);
    if (existing) throw new Error("Tier code already exists");

    return await tierRepository.create({
      tier_code: data.tier_code,
      tier_name: data.tier_name,
      min_spent_amount: data.min_spent_amount,
      point_multiplier: data.point_multiplier,
      description: data.description,
    });
  }

  async updateTier(id: string, data: any) {
    const tier = await tierRepository.findById(Number(id));
    if (!tier) throw new Error("Tier not found");

    if (data.tier_code && data.tier_code !== tier.tier_code) {
      const existing = await tierRepository.findByCode(data.tier_code);
      if (existing) throw new Error("Tier code already exists");
    }

    return await tierRepository.update(Number(id), {
      tier_code: data.tier_code,
      tier_name: data.tier_name,
      min_spent_amount: data.min_spent_amount,
      point_multiplier: data.point_multiplier,
      description: data.description,
    });
  }

  async deleteTier(id: string) {
    const tier = await tierRepository.findById(Number(id));
    if (!tier) throw new Error("Tier not found");
    return await tierRepository.delete(Number(id));
  }

  /**
   * Đánh giá lại và tự động cập nhật hạng thành viên cho khách hàng dựa trên tổng chi tiêu
   * @param customerId ID của khách hàng
   * @returns Thông tin khách hàng đã được update hạng (nếu có)
   */
  async evaluateCustomerTier(customerId: string) {
    const id = BigInt(customerId);
    
    // 1. Lấy khách hàng hiện tại
    const customer = await customerRepository.findById(id);
    if (!customer) {
      throw new Error('Customer not found');
    }

    // 2. Lấy tất cả các hạng thành viên, sắp xếp min_spent_amount giảm dần (từ cao xuống thấp)
    const tiers = await prisma.customerTier.findMany({
      orderBy: {
        min_spent_amount: 'desc',
      },
    });

    if (tiers.length === 0) return customer;

    // 3. Tìm hạng thẻ cao nhất mà khách hàng thỏa mãn (total_spent >= min_spent_amount)
    let qualifiedTier = tiers[tiers.length - 1]; // Mặc định là hạng thấp nhất
    for (const tier of tiers) {
      if (Number(customer.total_spent) >= Number(tier.min_spent_amount)) {
        qualifiedTier = tier;
        break; // Vì đã xếp giảm dần, nên tìm thấy đầu tiên chính là cao nhất
      }
    }

    // 4. Nếu có sự thay đổi hạng, tiến hành cập nhật
    if (customer.current_tier_id !== qualifiedTier.tier_id) {
      const updatedCustomer = await prisma.customer.update({
        where: { customer_id: id },
        data: { current_tier_id: qualifiedTier.tier_id },
        include: { tier: true },
      });
      return updatedCustomer;
    }

    return customer;
  }
}

export const tierService = new TierService();
