import { Request, Response } from "express";
import { campaignService } from "../services/campaign.service";

export const getCampaigns = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaigns = await campaignService.getAllCampaigns();
    res.status(200).json({ data: campaigns });
  } catch (error: unknown) {
    res.status(500).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const getCampaignById = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await campaignService.getCampaignById(req.params.id as string);
    res.status(200).json({ data: campaign });
  } catch (error: unknown) {
    res.status(404).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const createCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await campaignService.createCampaign(req.body);
    res.status(201).json({ message: "Campaign created", data: campaign });
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const updateCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await campaignService.updateCampaign(req.params.id as string, req.body);
    res.status(200).json({ message: "Campaign updated", data: campaign });
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const deleteCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    await campaignService.deleteCampaign(req.params.id as string);
    res.status(200).json({ message: "Campaign deleted" });
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const sendCampaign = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaign = await campaignService.sendCampaign(req.params.id as string);
    res.status(200).json({ message: "Campaign sent successfully", data: campaign });
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
  }
};

export const getCampaignRecipients = async (req: Request, res: Response): Promise<void> => {
  try {
    const recipients = await campaignService.getCampaignRecipients(req.params.id as string);
    res.status(200).json({ data: recipients });
  } catch (error: unknown) {
    res.status(400).json({ message: error instanceof Error ? error.message : String(error) });
  }
};
