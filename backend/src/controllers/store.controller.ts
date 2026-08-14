import { Request, Response } from "express";
import { StoreService } from "../services/store.service";

const storeService = new StoreService();
interface StoreParams {
  id: string;
}
export const createStore = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const store = await storeService.createStore(req.body);
    res
      .status(201)
      .json({ message: "Store created successfully", data: store });
  } catch (error: unknown) {
    res.status(400).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
};

export const getStores = async (req: Request, res: Response): Promise<void> => {
  try {
    const is_deleted = req.query.is_deleted === 'true';
    const stores = await storeService.getAllStores(is_deleted);
    res.status(200).json({ data: stores });
  } catch (error: unknown) {
    res.status(500).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
};

export const getStoreById = async (
  req: Request<StoreParams>,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const store = await storeService.getStoreById(id);
    res.status(200).json({ data: store });
  } catch (error: unknown) {
    res.status(404).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
};

export const updateStore = async (
  req: Request<StoreParams>,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const updatedStore = await storeService.updateStore(id, req.body);
    res
      .status(200)
      .json({ message: "Store updated successfully", data: updatedStore });
  } catch (error: unknown) {
    res.status(400).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
};

export const deleteStore = async (
  req: Request<StoreParams>,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await storeService.deleteStore(id);
    res.status(200).json({ message: "Store deleted successfully" });
  } catch (error: unknown) {
    res.status(400).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
};

export const restoreStore = async (
  req: Request<StoreParams>,
  res: Response,
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await storeService.restoreStore(id);
    res.status(200).json({ message: "Store restored successfully" });
  } catch (error: unknown) {
    res.status(400).json({ message: (error instanceof Error ? error.message : String(error)) });
  }
};
