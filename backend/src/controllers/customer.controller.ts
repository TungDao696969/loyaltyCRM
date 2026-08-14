import { Request, Response } from "express";
import { customerService } from "../services/customer.service";
import { transactionService } from "../services/transaction.service";
import { tierService } from "../services/tier.service";
import prisma from "../prisma";
import { tryCatch } from "bullmq";
interface CustomerParams {
  id: string;
}
export const getCustomers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Thu thập tất cả query params
    const filters = {
      is_deleted: req.query.is_deleted === "true",
      email: req.query.email as string,
      customer_id: req.query.customer_id as string,
      full_name: req.query.full_name as string,
      status: req.query.status as string,
      segment_id: req.query.segment_id as string, // Nếu muốn lọc theo phân loại
    };

    // Truyền object filter xuống service
    const customers = await customerService.getAllCustomers(filters);

    res.status(200).json({ data: customers });
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getCustomerById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const customer = await customerService.getCustomerById(
      req.params.id as string,
    );
    res.status(200).json({ data: customer });
  } catch (error: unknown) {
    if (
      (error instanceof Error ? error.message : String(error)) ===
      "Customer not found"
    ) {
      res.status(404).json({
        message: error instanceof Error ? error.message : String(error),
      });
      return;
    }
    res.status(500).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const createCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const customer = await customerService.createCustomer(req.body);
    res.status(201).json({ message: "Customer created", data: customer });
  } catch (error: unknown) {
    if (
      (error instanceof Error ? error.message : String(error)) ===
      "Phone number already exists"
    ) {
      res.status(400).json({
        message: error instanceof Error ? error.message : String(error),
      });
      return;
    }
    res.status(500).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const updateCustomer = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const customer = await customerService.updateCustomer(
      req.params.id as string,
      req.body,
    );
    res.status(200).json({ message: "Customer updated", data: customer });
  } catch (error: unknown) {
    if (
      (error instanceof Error ? error.message : String(error)) ===
      "Customer not found"
    ) {
      res.status(404).json({
        message: error instanceof Error ? error.message : String(error),
      });
      return;
    }
    if (
      (error instanceof Error ? error.message : String(error)) ===
      "Phone number already exists"
    ) {
      res.status(400).json({
        message: error instanceof Error ? error.message : String(error),
      });
      return;
    }
    res.status(500).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteCustomer = async (
  req: Request<CustomerParams>,
  res: Response,
): Promise<void> => {
  try {
    await customerService.deleteCustomer(req.params.id);
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error: unknown) {
    res.status(400).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const restoreCustomer = async (
  req: Request<CustomerParams>,
  res: Response,
): Promise<void> => {
  try {
    await customerService.restoreCustomer(req.params.id);
    res.status(200).json({ message: "Customer restored successfully" });
  } catch (error: unknown) {
    res.status(400).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getCustomerByPhone = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { phone } = req.params;
    const customer = await customerService.getCustomerByPhone(phone as string);
    if (!customer) {
      res.status(404).json({
        message: "Customer not found",
      });
      return;
    }

    res.status(200).json({
      data: customer,
    });
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const addSpentAmount = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || typeof amount !== "number") {
      res.status(400).json({ message: "Invalid amount" });
      return;
    }

    // Tăng total_spent (Demo only, in real app it's calculated from transactions)
    const customer = await prisma.customer.findUnique({
      where: { customer_id: BigInt(id as string) },
    });
    if (!customer) {
      res.status(404).json({ message: "Customer not found" });
      return;
    }

    const newSpent = Number(customer.total_spent) + amount;
    await prisma.customer.update({
      where: { customer_id: BigInt(id as string) },
      data: { total_spent: newSpent },
    });

    // Auto update tier
    const updatedCustomer = await tierService.evaluateCustomerTier(
      id as string,
    );

    // Ensure BigInt is serialized correctly via our normal routes or manual conversion if needed
    // The default JSON.stringify will fail on BigInt unless handled by Prisma/Express setup.
    // Assuming backend already handles BigInt.
    res.status(200).json({
      message: "Spent amount added and tier evaluated",
      data: {
        ...updatedCustomer,
        customer_id: updatedCustomer.customer_id.toString(), // Quick fix for BigInt in this custom controller
      },
    });
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getCustomerTransactions = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const transactions = await transactionService.getTransactionsByCustomerId(
      req.params.id as string,
    );
    res.status(200).json({ data: transactions });
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getCustomerCampaigns = async (
  req: Request<CustomerParams>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const history = await customerService.getCustomerCampaignHistory(id);

    res.status(200).json({
      data: history,
      message: "Lấy lịch sử chiến dịch thành công",
    });
  } catch (error: unknown) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getCustomerVouchers = async (
  req: Request<CustomerParams>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const vouchers = await customerService.getCustomerVouchersHistory(id);
    // Mảng vouchers có voucher_id (BigInt) nên polyfill ở index.ts của dự án sẽ tự động convert sang String
    res.status(200).json({
      data: vouchers,
      message: "Lấy lịch sử voucher thành công",
    });
  } catch (error: unknown) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Internal server error",
    });
  }
};
