import { Request, Response } from "express";
import { transactionService } from "../services/transaction.service";

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const transactions = await transactionService.getAllTransactions();
    res.status(200).json({ data: transactions });
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const getTransactionById = async (req: Request, res: Response): Promise<void> => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id as string);
    res.status(200).json({ data: transaction });
  } catch (error: unknown) {
    res.status(404).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const transaction = await transactionService.createTransaction(req.body);
    res.status(201).json({ message: "Transaction created", data: transaction });
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const updateTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const transaction = await transactionService.updateTransaction(req.params.id as string, req.body);
    res.status(200).json({ message: "Transaction updated", data: transaction });
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    await transactionService.deleteTransaction(req.params.id as string);
    res.status(200).json({ message: "Transaction deleted" });
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
  }
};
