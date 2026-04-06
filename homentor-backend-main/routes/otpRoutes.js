const express = require("express");
const { sendOtp, verifyOtp } = require("../utils/otpService");
const User = require("../models/User");
const Mentor = require("../models/Mentor");

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

    // After success: Find or create user
    if (userType === "student") {
      let user = await User.findOne({ phone });
      if (!user) {
        user = await User.create({ phone });
      }
      return res.json({ success: true, user });
    } else {
      let user = await Mentor.findOne({ phone });
      if (!user) {
        // FOR INTERNAL TESTING: Auto-create mentor if not found
        console.log(`[OTP SERVICE] Auto-creating test mentor for ${phone}`);
        user = await Mentor.create({ 
          phone, 
          fullName: "Test Mentor", 
          status: "Approved" // Correct Case for Enum
        });
      }
      return res.json({ success: true, user });
    }
  } catch (err) {
    console.error("OTP Route Verify Error:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
