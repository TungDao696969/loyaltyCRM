import { campaignRepository } from "../repositories/campaign.repository";
import { segmentService } from "./segment.service";
import { Prisma } from "@prisma/client";
import prisma from "../prisma";

export class CampaignService {
  async getAllCampaigns() {
    return await campaignRepository.findAll();
  }

  async getCampaignById(id: string) {
    const campaign = await campaignRepository.findById(Number(id));
    if (!campaign) throw new Error("Campaign not found");
    return campaign;
  }

  async createCampaign(data: any) {
    const input: Prisma.CampaignCreateInput = {
      campaign_name: data.campaign_name,
      channel: data.channel || 'SMS',
      message_template: data.message_template,
      status: data.status || 'draft',
      scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : undefined,
    };

    if (data.segment_id) {
      input.segment = { connect: { segment_id: Number(data.segment_id) } };
    }

    return await campaignRepository.create(input);
  }

  async updateCampaign(id: string, data: any) {
    const input: Prisma.CampaignUpdateInput = {
      campaign_name: data.campaign_name,
      channel: data.channel,
      message_template: data.message_template,
      status: data.status,
      scheduled_at: data.scheduled_at ? new Date(data.scheduled_at) : undefined,
    };

    if (data.segment_id) {
      input.segment = { connect: { segment_id: Number(data.segment_id) } };
    } else if (data.segment_id === null) {
      input.segment = { disconnect: true };
    }

    return await campaignRepository.update(Number(id), input);
  }

  async deleteCampaign(id: string) {
    return await campaignRepository.delete(Number(id));
  }

  async sendCampaign(id: string) {
    const campaign = await this.getCampaignById(id);
    if (!campaign) throw new Error("Campaign not found");
    if (campaign.status === 'sending' || campaign.status === 'sent') {
      throw new Error("Campaign is already sending or sent");
    }
    if (!campaign.segment_id) throw new Error("No target segment attached to this campaign");
    if (!campaign.message_template) throw new Error("No message template provided");

    // 1. Get customers from the segment
    const targetCustomers = await segmentService.getCustomersInSegment(campaign.segment_id.toString());
    
    if (targetCustomers.length === 0) {
      throw new Error("No customers match this segment's criteria");
    }

    // Filter valid phone numbers
    const validCustomers = targetCustomers.filter(c => c.phone_number);

    if (validCustomers.length === 0) {
      throw new Error("No customers with valid phone numbers found");
    }

    // 2. Create recipient records in DB
    const { smsQueue } = await import("./sms.queue");

    const recipientsData = validCustomers.map((customer) => ({
      campaign_id: Number(id),
      customer_id: customer.customer_id,
      phone: customer.phone_number,
      status: "pending",
    }));

    await prisma.campaignRecipient.createMany({
      data: recipientsData,
    });

    // 3. Get created recipients to queue them
    const recipients = await prisma.campaignRecipient.findMany({
      where: {
        campaign_id: Number(id),
        status: "pending"
      }
    });

    // 4. Add to BullMQ
    for (const recipient of recipients) {
      const customer = validCustomers.find(c => c.customer_id === recipient.customer_id);
      const message = campaign.message_template
        .replace(/{{name}}/g, customer?.full_name || 'Khách hàng')
        .replace(/{{points}}/g, customer?.total_points?.toString() || '0');

      await smsQueue.add("send-sms", {
        campaignId: Number(id),
        recipientId: recipient.id,
        phone: recipient.phone,
        message,
      });
    }

    // 5. Update campaign status to 'sending'
    return await campaignRepository.update(Number(id), {
      status: 'sending'
    });
  }

  async getCampaignRecipients(id: string) {
    return await prisma.campaignRecipient.findMany({
      where: { campaign_id: Number(id) },
      orderBy: { created_at: 'desc' },
      include: {
        customer: {
          select: {
            full_name: true,
            phone_number: true,
          }
        }
      }
    });
  }
}

export const campaignService = new CampaignService();
