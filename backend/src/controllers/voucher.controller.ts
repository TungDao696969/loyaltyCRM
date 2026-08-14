import { Request, Response } from "express";
import { voucherService } from "../services/voucher.service";

interface VoucherParams {
  id: string;
}
export const getVouchers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const vouchers = await voucherService.getAllVouchers();
    res.status(200).json({ data: vouchers });
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getVoucherById = async (
  req: Request<VoucherParams>,
  res: Response,
): Promise<void> => {
  try {
    const voucher = await voucherService.getVoucherById(req.params.id);
    res.status(200).json({ data: voucher });
  } catch (error: unknown) {
    res.status(404).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const createVoucher = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const voucher = await voucherService.createVoucher(req.body);
    res.status(201).json({ message: "Voucher created", data: voucher });
  } catch (error: unknown) {
    res.status(400).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const exchangeVoucher = async (req: Request, res: Response): Promise<void> => {
  try {
    const { customer_id, reward_id } = req.body;
    if (!customer_id || !reward_id) {
      res.status(400).json({ message: "customer_id and reward_id are required" });
      return;
    }
    const voucher = await voucherService.exchangePointsForVoucher(customer_id, String(reward_id));
    res.status(200).json({ message: "Voucher generated from points", data: voucher });
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

import prisma from "../prisma";
export const getRewards = async (req: Request, res: Response): Promise<void> => {
  try {
    const rewards = await prisma.rewardCatalog.findMany({
      where: { is_active: true }
    });
    res.status(200).json({ data: rewards });
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const updateVoucher = async (
  req: Request<VoucherParams>,
  res: Response,
): Promise<void> => {
  try {
    const voucher = await voucherService.updateVoucher(req.params.id, req.body);
    res.status(200).json({ message: "Voucher updated", data: voucher });
  } catch (error: unknown) {
    res.status(400).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const deleteVoucher = async (
  req: Request<VoucherParams>,
  res: Response,
): Promise<void> => {
  try {
    await voucherService.deleteVoucher(req.params.id);
    res.status(200).json({ message: "Voucher deleted successfully" });
  } catch (error: unknown) {
    res.status(400).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const applyVoucher = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { voucher_code, customer_id } = req.body;
    if (!voucher_code) {
      res.status(400).json({ message: "Voucher code is required" });
      return;
    }
    const voucher = await voucherService.applyVoucher(
      voucher_code,
      customer_id,
    );
    res
      .status(200)
      .json({ message: "Voucher applied successfully", data: voucher });
  } catch (error: unknown) {
    res.status(400).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const checkVoucher = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { voucher_code, customer_id, order_amount } = req.body;
    if (!voucher_code) {
      res.status(400).json({ message: "Voucher code is required" });
      return;
    }
    const voucher = await voucherService.checkVoucher(
      voucher_code,
      customer_id,
      order_amount ? Number(order_amount) : undefined
    );
    res
      .status(200)
      .json({ message: "Voucher is valid", data: voucher });
  } catch (error: unknown) {
    res.status(400).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
