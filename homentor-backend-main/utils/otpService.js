const axios = require("axios");

// Simple in-memory store for OTPs (In production, use Redis)
const otpStore = {};

/**
 * Send OTP via Message Central or Log to Console for testing
 */
const sendOtp = async (mobileNumber) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 5 * 60 * 1000; // 5 minutes

  otpStore[mobileNumber] = { otp, expires };

  // ⚠️ ALWAYS LOG TO CONSOLE FOR TESTING
  console.log(`\n************************************************`);
  console.log(`[OTP SERVICE] Mobile: ${mobileNumber} | Test OTP: ${otp} | Master OTP: ${process.env.TEST_OTP || "123456"}`);
  console.log(`************************************************\n`);

  // If no credentials, just return success (Test Mode)
  if (!process.env.MESSAGE_CENTRAL_AUTH_TOKEN || process.env.MESSAGE_CENTRAL_AUTH_TOKEN === "YOUR_AUTH_TOKEN") {
    console.log("[OTP SERVICE] Running in TEST MODE (No Auth Token). Use 123456 or the OTP above.");
    return { success: true, message: "OTP logged to terminal (Test Mode)", verificationId: "test-id-" + Date.now() };
  }

  try {
    const url = "https://cpaas.messagecentral.com/verification/v3/send";
    const response = await axios.post(url, null, {
      params: {
        countryCode: "91",
        mobileNumber: mobileNumber,
        flowType: "SMS",
      },
      headers: {
        authToken: process.env.MESSAGE_CENTRAL_AUTH_TOKEN,
      },
    });

    return { 
      success: true, 
      verificationId: response.data?.data?.verificationId || "local-id-" + Date.now() 
    };
  } catch (err) {
    console.error("[OTP SERVICE] Message Central Send Error:", err.response?.data || err.message);
    return { success: true, message: "API failed, but OTP logged to terminal", verificationId: "fallback-id-" + Date.now() };
  }
};

/**
 * Verify OTP (Supports Master OTP + Local store + Remote API)
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

  // 2. Check Remote API (If verificationId looks real)
  if (verificationId && !verificationId.includes("test-id") && !verificationId.includes("fallback-id")) {
    try {
      console.log(`[OTP SERVICE] Calling Message Central to verify for ${mobileNumber} (ID: ${verificationId}, Code: ${inputCode})`);
      const url = "https://cpaas.messagecentral.com/verification/v3/validateOtp";
      const response = await axios.get(url, {
        params: {
          verificationId,
          code: inputCode,
        },
        headers: {
          authToken: process.env.MESSAGE_CENTRAL_AUTH_TOKEN,
        },
      });

      console.log("[OTP SERVICE] Remote API Response:", JSON.stringify(response.data));

      if (response.data?.data?.verificationStatus === "VERIFIED" || response.data?.responseCode === 200) {
        console.log(`[OTP SERVICE] Remote API SUCCESS for ${mobileNumber}`);
        return { success: true };
      }
    } catch (err) {
      console.error("[OTP SERVICE] Remote Validation Error Detail:", err.response?.data || err.message);
    }
  }

  // 3. Fallback to Local store
  const stored = otpStore[mobileNumber];
  if (stored) {
    if (stored.otp.toString().trim() === inputCode) {
      if (Date.now() < stored.expires) {
        delete otpStore[mobileNumber];
        console.log(`[OTP SERVICE] Local Store OTP SUCCESS for ${mobileNumber}`);
        return { success: true };
      }
      console.log(`[OTP SERVICE] Local OTP expired for ${mobileNumber}`);
    }
  }

  console.log(`[OTP SERVICE] Invalid OTP attempt for ${mobileNumber}: got="${inputCode}"`);
  return { success: false, message: "Invalid OTP" };
};

module.exports = { sendOtp, verifyOtp };
