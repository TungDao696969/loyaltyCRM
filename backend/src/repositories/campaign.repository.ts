import prisma from "../prisma";
import { Prisma, Campaign } from "@prisma/client";

export class CampaignRepository {
  async findAll(): Promise<Campaign[]> {
    return prisma.campaign.findMany({
      include: { segment: true },
      orderBy: { campaign_id: "desc" },
    });
  }

  async findById(id: number): Promise<Campaign | null> {
    return prisma.campaign.findUnique({
      where: { campaign_id: id },
      include: { segment: true },
    });
  }

  async create(data: Prisma.CampaignCreateInput): Promise<Campaign> {
    return prisma.campaign.create({
      data,
    });
  }

  async update(id: number, data: Prisma.CampaignUpdateInput): Promise<Campaign> {
    return prisma.campaign.update({
      where: { campaign_id: id },
      data,
    });
  }

  async delete(id: number): Promise<Campaign> {
    return prisma.campaign.delete({
      where: { campaign_id: id },
    });
  }
}

export const campaignRepository = new CampaignRepository();
