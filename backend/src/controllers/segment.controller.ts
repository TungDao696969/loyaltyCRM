import { Request, Response } from "express";
import { segmentService } from "../services/segment.service";

export const getSegments = async (req: Request, res: Response): Promise<void> => {
  try {
    const segments = await segmentService.getAllSegments();
    res.status(200).json({ data: segments });
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const getSegmentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const segment = await segmentService.getSegmentById(req.params.id as string);
    res.status(200).json({ data: segment });
  } catch (error: unknown) {
    res.status(404).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const createSegment = async (req: Request, res: Response): Promise<void> => {
  try {
    const segment = await segmentService.createSegment(req.body);
    res.status(201).json({ message: "Segment created", data: segment });
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const updateSegment = async (req: Request, res: Response): Promise<void> => {
  try {
    const segment = await segmentService.updateSegment(req.params.id as string, req.body);
    res.status(200).json({ message: "Segment updated", data: segment });
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const deleteSegment = async (req: Request, res: Response): Promise<void> => {
  try {
    await segmentService.deleteSegment(req.params.id as string);
    res.status(200).json({ message: "Segment deleted" });
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const getSegmentCustomers = async (req: Request, res: Response): Promise<void> => {
  try {
    const customers = await segmentService.getCustomersInSegment(req.params.id as string);
    // Xử lý serialize BigInt thủ công ở lớp controller nếu cần, nhưng express middleware đã lo việc đó rồi
    res.status(200).json({ data: customers, count: customers.length });
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
  }
};
