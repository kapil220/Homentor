const twilio = require("twilio");

// Simple in-memory store for OTPs (In production, use Redis)
const otpStore = {};

// Initialize Twilio client
const getTwilioClient = () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) return null;
  return twilio(accountSid, authToken);
};

/**
 * Send OTP via Twilio SMS or Log to Console for testing
 */
const sendOtp = async (mobileNumber) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore[mobileNumber] = { otp, expires };

  // ⚠️ ALWAYS LOG TO CONSOLE FOR TESTING
  console.log(`\n************************************************`);
  console.log(`[OTP SERVICE] Mobile: ${mobileNumber} | Test OTP: ${otp} | Master OTP: ${process.env.TEST_OTP || "123456"}`);
  console.log(`************************************************\n`);

  const client = getTwilioClient();

  // If no credentials, just return success (Test Mode)
  if (!client) {
    console.log("[OTP SERVICE] Running in TEST MODE (No Twilio credentials). Use 123456 or the OTP above.");
    return { success: true, message: "OTP logged to terminal (Test Mode)", verificationId: "test-id-" + Date.now() };
  }

  try {
    // Format number for India: ensure +91 prefix
    let toNumber = mobileNumber.toString().replace(/\s+/g, "");
    if (!toNumber.startsWith("+")) {
      toNumber = toNumber.startsWith("91") ? `+${toNumber}` : `+91${toNumber}`;
    }

    const message = await client.messages.create({
      body: `Your Homentor verification code is: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: toNumber,
    });

    console.log(`[OTP SERVICE] Twilio SMS sent successfully. SID: ${message.sid}`);
    return {
      success: true,
      message: "OTP sent via SMS",
      verificationId: message.sid,
    };
  } catch (err) {
    console.error("[OTP SERVICE] Twilio Send Error:", err.message);
    // Fallback: OTP is still stored locally, usable via console
    return { success: true, message: "SMS failed, but OTP logged to terminal", verificationId: "fallback-id-" + Date.now() };
  }
};

/**
 * Verify OTP (Supports Master OTP + Local store)
 * With Twilio raw SMS, verification is done locally since we generate the OTP ourselves.
 */
const verifyOtp = async (mobileNumber, code, verificationId) => {
  const inputCode = code.toString().trim();
  const masterOtp = (process.env.TEST_OTP || "123456").toString().trim();

  console.log(`[OTP DEBUG] Checking: input="${inputCode}" vs master="${masterOtp}" for ${mobileNumber}`);

  // 1. Check Master OTP (Always works)
  if (inputCode === masterOtp) {
    console.log(`[OTP SERVICE] Master OTP SUCCESS for ${mobileNumber}`);
    return { success: true, message: "Master OTP verified" };
  }

  // 2. Check Local store (primary verification for Twilio raw SMS)
  const stored = otpStore[mobileNumber];
  if (stored) {
    if (stored.otp.toString().trim() === inputCode) {
      if (Date.now() < stored.expires) {
        delete otpStore[mobileNumber];
        console.log(`[OTP SERVICE] OTP verified SUCCESS for ${mobileNumber}`);
        return { success: true, message: "OTP verified" };
      }
      console.log(`[OTP SERVICE] OTP expired for ${mobileNumber}`);
      return { success: false, message: "OTP expired. Please request a new one." };
    }
  }

  console.log(`[OTP SERVICE] Invalid OTP attempt for ${mobileNumber}: got="${inputCode}"`);
  return { success: false, message: "Invalid OTP" };
};

module.exports = { sendOtp, verifyOtp };
