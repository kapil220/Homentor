const express = require("express");
const { sendOtp, verifyOtp } = require("../utils/otpService");
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const generatePassword = require("../utils/generatePassword");
const { sendEvent: sendWhatsappEvent } = require("../utils/whatsappService");

const sharePasswordOnWhatsapp = (phone, name, password) => {
  const waTo = String(phone).replace(/\D/g, "").slice(-10);
  if (waTo.length !== 10) return;
  sendWhatsappEvent("password_share", { to: `91${waTo}`, name, password }).catch(() => {});
};

const router = express.Router();

// 🚀 Send OTP
router.post("/send-otp", async (req, res) => {
  const { mobile, userType } = req.body;
  
  if (!mobile) {
    return res.status(400).json({ success: false, message: "Mobile number required" });
  }

  try {
    const result = await sendOtp(mobile);
    res.status(200).json({ 
      success: true, 
      message: result.message || "OTP sent- Check terminal!", 
      verificationId: result.verificationId 
    });
  } catch (err) {
    console.error("OTP Route Send Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Verify OTP
router.post("/verify-otp", async (req, res) => {
  const { code, phone, userType, verificationId } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ success: false, message: "Phone and Code are required" });
  }

  try {
    const verification = await verifyOtp(phone, code, verificationId);
    
    if (!verification.success) {
      return res.status(400).json({ success: false, message: verification.message });
    }

    // After success: Find or create user. Auto-issue a password on first signup so
    // the account can also log in via the password flow (Section C — C4/C6).
    let generatedPassword = null;
    if (userType === "student") {
      let user = await User.findOne({ phone });
      if (!user) {
        generatedPassword = generatePassword();
        user = await User.create({
          phone,
          password: generatedPassword,
          passwordPlain: generatedPassword,
        });
      } else if (!user.password) {
        generatedPassword = generatePassword();
        user.password = generatedPassword;
        user.passwordPlain = generatedPassword;
        await user.save();
      }
      if (generatedPassword) sharePasswordOnWhatsapp(phone, user.parentName, generatedPassword);
      return res.json({ success: true, user, generatedPassword });
    } else {
      let user = await Mentor.findOne({ phone });
      if (!user) {
        console.log(`[OTP SERVICE] Auto-creating test mentor for ${phone}`);
        generatedPassword = generatePassword();
        user = await Mentor.create({
          phone,
          fullName: "Test Mentor",
          status: "Approved",
          password: generatedPassword,
          passwordPlain: generatedPassword,
        });
      } else if (!user.password) {
        generatedPassword = generatePassword();
        user.password = generatedPassword;
        user.passwordPlain = generatedPassword;
        await user.save();
      }
      if (generatedPassword) sharePasswordOnWhatsapp(phone, user.fullName, generatedPassword);
      return res.json({ success: true, user, generatedPassword });
    }
  } catch (err) {
    console.error("OTP Route Verify Error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
