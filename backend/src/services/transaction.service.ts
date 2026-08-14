import { transactionRepository } from "../repositories/transaction.repository";
import { customerRepository } from "../repositories/customer.repository";
import { tierService } from "./tier.service";
import { voucherService } from "./voucher.service";
import prisma from "../prisma";
import { Prisma } from "@prisma/client";

export class TransactionService {
  async getAllTransactions() {
    return await transactionRepository.findAll();
  }

  async getTransactionById(id: string) {
    const transaction = await transactionRepository.findById(BigInt(id));
    if (!transaction) throw new Error("Transaction not found");
    return transaction;
  }

  async getTransactionsByCustomerId(customerId: string) {
    return await transactionRepository.findByCustomerId(BigInt(customerId));
  }

  async createTransaction(data: any) {
    // Basic fields
    const originalOrderAmount = Number(data.order_amount || 0);
    let orderAmount = originalOrderAmount;
    let appliedVoucher = null;

    if (data.voucher_code && data.customer_id) {
      appliedVoucher = await voucherService.checkVoucher(data.voucher_code, data.customer_id, originalOrderAmount);
      let discount = Number(appliedVoucher.discount_value);
      if (appliedVoucher.voucher_type === 'PERCENTAGE') {
        discount = (originalOrderAmount * discount) / 100;
        if (appliedVoucher.max_discount && discount > Number(appliedVoucher.max_discount)) {
          discount = Number(appliedVoucher.max_discount);
        }
      }
      orderAmount = Math.max(0, originalOrderAmount - discount);
    }

    let points = Number(data.points || 0);
    const transactionType = data.transaction_type || 'EARN'; // EARN or REDEEM
    let balanceAfter = 0;
    const posInvoiceCode = data.pos_invoice_code || `INV-${Date.now()}`;

    let transactionInput: Prisma.PointTransactionCreateInput = {
      pos_invoice_code: posInvoiceCode,
      transaction_type: transactionType,
      order_amount: orderAmount,
      points: points,
      balance_after: 0,
      is_offline_sync: data.is_offline_sync || false,
    };

    if (data.store_id) {
      transactionInput.store = { connect: { id: Number(data.store_id) } };
    }

    if (data.customer_id) {
      const customer = await customerRepository.findById(BigInt(data.customer_id));
      if (!customer) throw new Error("Customer not found");

      if (transactionType === 'REDEEM') {
        if (customer.total_points < points) {
          throw new Error("Not enough points to redeem");
        }
        balanceAfter = customer.total_points - points;
      } else {
        // EARN points: Auto-calculate if not explicitly provided or if provided as 0
        if (points === 0 && orderAmount > 0) {
          // 1. Get active loyalty rule
          const activeRule = await prisma.loyaltyRule.findFirst({
            where: { is_active: true, rule_type: 'EARN' },
            orderBy: { start_date: 'desc' }
          });
          
          // Default conversion rate: 10,000 VND = 1 point
          const conversionRate = activeRule ? Number(activeRule.conversion_rate) : 10000;
          
          let basePoints = 0;
          if (conversionRate > 0) {
            // For example, orderAmount = 50000, conversionRate = 10000 => basePoints = 5.
            // If conversionRate is e.g. 0.0001, we might need to multiply.
            // Usually conversion_rate is stored as 10000. Let's assume orderAmount / conversionRate.
            basePoints = Math.floor(orderAmount / conversionRate);
          }
          
          // 2. Get customer tier point multiplier
          let multiplier = 1.0;
          if (customer.tier) {
            multiplier = Number(customer.tier.point_multiplier);
          }
          
          points = Math.floor(basePoints * multiplier);
        }

        balanceAfter = customer.total_points + points;
      }

      transactionInput.points = points;
      transactionInput.balance_after = balanceAfter;
      transactionInput.customer = { connect: { customer_id: BigInt(data.customer_id) } };

      // Update customer total points and total spent
      await customerRepository.update(BigInt(data.customer_id), {
        total_points: balanceAfter,
        total_spent: Number(customer.total_spent) + orderAmount
      });

      // Auto evaluate tier after transaction
      await tierService.evaluateCustomerTier(data.customer_id);
    } else {
      transactionInput.balance_after = 0;
    }

    const transaction = await transactionRepository.create(transactionInput);

    if (appliedVoucher) {
      await voucherService.applyVoucher(data.voucher_code, data.customer_id);
    }

    return transaction;
  }

  // Edit and Delete are provided for full CRUD assignment requirements, 
  // though typically restricted in real systems
  async updateTransaction(id: string, data: any) {
    return await transactionRepository.update(BigInt(id), {
      pos_invoice_code: data.pos_invoice_code,
      transaction_type: data.transaction_type,
      order_amount: data.order_amount,
      points: data.points,
    });
  }

  async deleteTransaction(id: string) {
    return await transactionRepository.delete(BigInt(id));
  }
}

export const transactionService = new TransactionService();
