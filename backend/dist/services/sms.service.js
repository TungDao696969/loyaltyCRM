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
exports.sendSMS = sendSMS;
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = (0, twilio_1.default)(process.env.TWILIO_ACCOUNT_SID || "AC_mock_sid", process.env.TWILIO_AUTH_TOKEN || "mock_token");
function sendSMS(phone, message) {
    return __awaiter(this, void 0, void 0, function* () {
        // If no real credentials, return a mock success
        if (!process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID === "AC_mock_sid") {
            console.log(`[Mock SMS] To: ${phone} | Body: ${message}`);
            return {
                messageId: `mock_${Date.now()}`,
                status: "queued"
            };
        }
        const result = yield client.messages.create({
            body: message,
            from: process.env.TWILIO_PHONE_NUMBER || "+1234567890",
            to: phone
        });
        return {
            messageId: result.sid,
            status: result.status
        };
    });
}
