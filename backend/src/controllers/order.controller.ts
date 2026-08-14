import { Request, Response } from "express";
import { orderService } from "../services/order.service";


export const getCustomerOrders = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const orders = await orderService.getCustomerOrders(req.params.id as string);
    res.status(200).json({ data: orders });
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getAllOrders = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const orders = await orderService.getAllOrders();
    res.status(200).json({ data: orders });
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
export const createOrder = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json({
      message: "Order created successfully",
      data: order,
    });
  } catch (error: unknown) {
    res.status(500).json({
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
