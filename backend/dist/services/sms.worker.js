"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsWorker = void 0;
const bullmq_1 = require("bullmq");
const sms_service_1 = require("./sms.service");
const prisma_1 = __importDefault(require("../prisma"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const connection = {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
};
exports.smsWorker = new bullmq_1.Worker("sms", (job) => __awaiter(void 0, void 0, void 0, function* () {
    const { recipientId, phone, message } = job.data;
    try {
        const result = yield (0, sms_service_1.sendSMS)(phone, message);
        yield prisma_1.default.campaignRecipient.update({
            where: { id: recipientId },
            data: {
                status: "sent",
                provider_message_id: result.messageId,
                sent_at: new Date(),
            },
        });
        console.log(`[SMS Worker] Successfully sent SMS to ${phone} (Recipient ID: ${recipientId})`);
    }
    catch (error) {
        console.error(`[SMS Worker] Failed to send SMS to ${phone} (Recipient ID: ${recipientId}):`, error);
        yield prisma_1.default.campaignRecipient.update({
            where: { id: recipientId },
            data: {
                status: "failed",
                error_message: error instanceof Error ? error.message : "Unknown error",
            },
        });
        throw error;
    }
}), {
    connection,
});
exports.smsWorker.on("completed", (job) => {
    console.log(`[SMS Worker] Job ${job.id} completed successfully`);
});
exports.smsWorker.on("failed", (job, err) => {
    console.log(`[SMS Worker] Job ${job === null || job === void 0 ? void 0 : job.id} failed with error: ${err.message}`);
});
