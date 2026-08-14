import { voucherRepository } from "../repositories/voucher.repository";
import { customerRepository } from "../repositories/customer.repository";
import { transactionRepository } from "../repositories/transaction.repository";
import { Prisma, Voucher } from "@prisma/client";
import prisma from "../prisma";
export class VoucherService {
  async getAllVouchers(): Promise<Voucher[]> {
    return await voucherRepository.findAll();
  }

  async getVoucherById(id: string) {
    const voucher = await voucherRepository.findById(BigInt(id));
    if (!voucher) {
      throw new Error("Voucher not found");
    }
    return voucher;
  }

  async getVoucherByCode(code: string) {
    const voucher = await voucherRepository.findByCode(code);
    if (!voucher) {
      throw new Error("Voucher not found");
    }
    return voucher;
  }

  async createVoucher(data: any) {
    // Tự động sinh mã voucher nếu không có
    let voucherCode = data.voucher_code;
    if (!voucherCode) {
      const generateCode = () => 'VOUCHER-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      voucherCode = generateCode();
      // Ensure unique
      let existing = await voucherRepository.findByCode(voucherCode);
      while (existing) {
        voucherCode = generateCode();
        existing = await voucherRepository.findByCode(voucherCode);
      }
    } else {
      const existing = await voucherRepository.findByCode(voucherCode);
      if (existing) {
        throw new Error("Voucher code already exists");
      }
    }

    const voucherInput: Prisma.VoucherCreateInput = {
      voucher_code: voucherCode,
      voucher_type: data.voucher_type || "FIXED",
      discount_value: data.discount_value,
      max_discount: data.max_discount,
      min_order_value: data.min_order_value,
      status: data.status || "active",
      expired_at: data.expired_at ? new Date(data.expired_at) : undefined,
    };

    if (data.campaign_id) {
      voucherInput.campaign = { connect: { campaign_id: Number(data.campaign_id) } };
    }

    if (data.customer_id) {
      voucherInput.customer = {
        connect: { customer_id: BigInt(data.customer_id) }
      };
    }

    return await voucherRepository.create(voucherInput);
  }

  async updateVoucher(id: string, data: any) {
    const voucher = await voucherRepository.findById(BigInt(id));
    if (!voucher) {
      throw new Error("Voucher not found");
    }

    if (data.voucher_code && data.voucher_code !== voucher.voucher_code) {
      const existing = await voucherRepository.findByCode(data.voucher_code);
      if (existing) {
        throw new Error("Voucher code already exists");
      }
    }

    const updateInput: Prisma.VoucherUpdateInput = {
      voucher_code: data.voucher_code,
      voucher_type: data.voucher_type,
      discount_value: data.discount_value,
      max_discount: data.max_discount,
      min_order_value: data.min_order_value,
      status: data.status,
      expired_at: data.expired_at ? new Date(data.expired_at) : undefined,
    };

    if (data.campaign_id) {
      updateInput.campaign = { connect: { campaign_id: Number(data.campaign_id) } };
    } else if (data.campaign_id === null) {
      updateInput.campaign = { disconnect: true };
    }

    if (data.customer_id) {
      updateInput.customer = {
        connect: { customer_id: BigInt(data.customer_id) }
      };
    } else if (data.customer_id === null) {
      updateInput.customer = { disconnect: true };
    }

    return await voucherRepository.update(BigInt(id), updateInput);
  }

  async deleteVoucher(id: string): Promise<Voucher> {
    const voucherId = BigInt(id);
    await this.getVoucherById(id);
    return await voucherRepository.delete(voucherId);
  }

  async applyVoucher(code: string, customerId?: string) {
    const voucher = await voucherRepository.findByCode(code);
    if (!voucher) {
      throw new Error("Voucher not found");
    }

    if (voucher.status !== "active") {
      throw new Error(`Voucher is ${voucher.status}`);
    }

    if (voucher.expired_at && new Date() > voucher.expired_at) {
      throw new Error("Voucher has expired");
    }

    if (voucher.customer_id && customerId && voucher.customer_id !== BigInt(customerId)) {
      throw new Error("Voucher does not belong to this customer");
    }

    // Mark as used
    return await voucherRepository.update(voucher.voucher_id, {
      status: "used",
      used_at: new Date()
    });
  }

  async checkVoucher(code: string, customerId?: string, orderAmount?: number) {
    const voucher = await voucherRepository.findByCode(code);
    if (!voucher) {
      throw new Error("Voucher not found");
    }

    if (voucher.status !== "active") {
      throw new Error(`Voucher is ${voucher.status}`);
    }

    if (voucher.expired_at && new Date() > voucher.expired_at) {
      throw new Error("Voucher has expired");
    }

    if (voucher.customer_id && customerId && voucher.customer_id !== BigInt(customerId)) {
      throw new Error("Voucher does not belong to this customer");
    }

    if (orderAmount !== undefined && voucher.min_order_value && orderAmount < Number(voucher.min_order_value)) {
      throw new Error(`Order amount must be at least ${Number(voucher.min_order_value)} to use this voucher`);
    }

    return voucher;
  }

  async exchangePointsForVoucher(customerId: string, rewardId: string) {
    const reward = await prisma.rewardCatalog.findUnique({
      where: { reward_id: Number(rewardId) }
    });

    if (!reward || !reward.is_active) {
      throw new Error("Reward not found or inactive");
    }

    const pointsToExchange = reward.required_points;
    if (pointsToExchange <= 0) {
      throw new Error("Points to exchange must be greater than 0");
    }

    const customer = await customerRepository.findById(BigInt(customerId));
    if (!customer) {
      throw new Error("Customer not found");
    }

    if (customer.total_points < pointsToExchange) {
      throw new Error(`Customer only has ${customer.total_points} points. Not enough to exchange ${pointsToExchange} points.`);
    }

    // Deduct points
    const newBalance = customer.total_points - pointsToExchange;
    await customerRepository.update(BigInt(customerId), {
      total_points: newBalance
    });

    // Log the transaction
    await transactionRepository.create({
      customer: { connect: { customer_id: BigInt(customerId) } },
      pos_invoice_code: `EXCHANGE-${Date.now()}`,
      transaction_type: 'REDEEM',
      order_amount: 0,
      points: pointsToExchange,
      balance_after: newBalance,
      is_offline_sync: false
    });

    const discountValue = reward.voucher_discount_value || 0;

    const generateCode = () => 'EXC-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    let voucherCode = generateCode();
    let existing = await voucherRepository.findByCode(voucherCode);
    while (existing) {
      voucherCode = generateCode();
      existing = await voucherRepository.findByCode(voucherCode);
    }

    // Expires in 30 days
    const expiredAt = new Date();
    expiredAt.setDate(expiredAt.getDate() + 30);

    return await voucherRepository.create({
      voucher_code: voucherCode,
      voucher_type: reward.reward_type === 'VOUCHER' ? 'FIXED' : 'GIFT',
      discount_value: discountValue,
      status: 'active',
      expired_at: expiredAt,
      customer: { connect: { customer_id: BigInt(customerId) } }
    });
  }
}

export const voucherService = new VoucherService();
