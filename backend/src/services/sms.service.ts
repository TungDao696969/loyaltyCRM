import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID || "AC_mock_sid",
  process.env.TWILIO_AUTH_TOKEN || "mock_token"
);

export async function sendSMS(phone: string, message: string) {
  // If no real credentials, return a mock success
  if (!process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_ACCOUNT_SID === "AC_mock_sid") {
    console.log(`[Mock SMS] To: ${phone} | Body: ${message}`);
    return {
      messageId: `mock_${Date.now()}`,
      status: "queued"
    };
  }

  const result = await client.messages.create({
    body: message,
    from: process.env.TWILIO_PHONE_NUMBER || "+1234567890",
    to: phone
  });

  return {
    messageId: result.sid,
    status: result.status
  };
}
