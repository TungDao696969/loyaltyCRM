import { Worker } from "bullmq";
import { sendSMS } from "./sms.service";
import prisma from "../prisma";
import dotenv from "dotenv";

dotenv.config();

const connection = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
};

export const smsWorker = new Worker(
  "sms",
  async (job) => {
    const { recipientId, phone, message } = job.data;

    try {
      const result = await sendSMS(phone, message);

      await prisma.campaignRecipient.update({
        where: { id: recipientId },
        data: {
          status: "sent",
          provider_message_id: result.messageId,
          sent_at: new Date(),
        },
      });
      
      console.log(`[SMS Worker] Successfully sent SMS to ${phone} (Recipient ID: ${recipientId})`);
    } catch (error) {
      console.error(`[SMS Worker] Failed to send SMS to ${phone} (Recipient ID: ${recipientId}):`, error);

      await prisma.campaignRecipient.update({
        where: { id: recipientId },
        data: {
          status: "failed",
          error_message: error instanceof Error ? error.message : "Unknown error",
        },
      });

      throw error;
    }
  },
  {
    connection,
  }
);

smsWorker.on("completed", (job) => {
  console.log(`[SMS Worker] Job ${job.id} completed successfully`);
});

smsWorker.on("failed", (job, err) => {
  console.log(`[SMS Worker] Job ${job?.id} failed with error: ${err.message}`);
});
