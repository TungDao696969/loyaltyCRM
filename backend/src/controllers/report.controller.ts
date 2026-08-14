import { Request, Response } from "express";
import { reportService } from "../services/report.service";

export const getDashboardReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const report = await reportService.getDashboardReport();
    res.status(200).json({ data: report });
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
  }
};
