import { Request, Response } from "express";
import { tierService } from "../services/tier.service";

export const getTiers = async (req: Request, res: Response): Promise<void> => {
  try {
    const tiers = await tierService.getAllTiers();
    res.status(200).json({ data: tiers });
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const getTierById = async (req: Request, res: Response): Promise<void> => {
  try {
    const tier = await tierService.getTierById(req.params.id as string);
    res.status(200).json({ data: tier });
  } catch (error: unknown) {
    res.status(404).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const createTier = async (req: Request, res: Response): Promise<void> => {
  try {
    const tier = await tierService.createTier(req.body);
    res.status(201).json({ message: "Tier created", data: tier });
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const updateTier = async (req: Request, res: Response): Promise<void> => {
  try {
    const tier = await tierService.updateTier(req.params.id as string, req.body);
    res.status(200).json({ message: "Tier updated", data: tier });
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const deleteTier = async (req: Request, res: Response): Promise<void> => {
  try {
    await tierService.deleteTier(req.params.id as string);
    res.status(200).json({ message: "Tier deleted" });
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
  }
};
