const express = require("express");
const router = express.Router();
const User = require("../models/User");


router.post("/save-fcm-token", async (req, res) => {
  const { userId, token } = req.body;

  await User.findByIdAndUpdate(userId, { fcmToken: token });

  res.json({ success: true });
});

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET single user
router.post("/login-check", async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.body.phone });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Verify OTP (uses shared otpService)
router.post("/verify-check", async (req, res) => {
  const { verificationId, code, phone } = req.body;

  if (!phone || !code) {
    return res.status(400).json({ message: "Phone and code are required" });
  }

  try {
    const { verifyOtp } = require("../utils/otpService");
    const result = await verifyOtp(phone, code, verificationId);

    if (result.success) {
      res.status(200).json({
        message: "OTP verified",
        verificationStatus: "VERIFIED",
      });
    } else {
      res.status(400).json({ message: result.message || "OTP validation failed" });
    }
  } catch (err) {
    console.error("OTP validation failed:", err.message);
    res.status(500).json({ message: "OTP validation failed" });
  }
});

// CREATE user
router.post("/", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      gender,
      phoneNumber,
      roomAllocated,
      feeStatus,
      detailPhotos,
    } = req.body;

    const newUser = new User({
      name,
      email,
      password,
      gender,
      phoneNumber,
      roomAllocated: roomAllocated || null,
      feeStatus: feeStatus || "unpaid",
      detailPhotos: {
        rentAgreement: detailPhotos?.rentAgreement || [],
        aadharPhotos: detailPhotos?.aadharPhotos || [],
        passportPhoto: detailPhotos?.passportPhoto || "",
      },
    });

    const room = await Room.findById(roomAllocated);

    if (!room) {
      return res.status(404).json({ message: "Room Not Found" });
    }

    if (room.capacity > room.occupied) {
      await newUser.save();
    } else {
      return res.status(404).json({ message: "Room is fully occupied" });
    }

    room.occupied = room.occupied + 1;
    room.currentRentStatus.rentDue = room.rent;
    room.currentRentStatus.totalRent = room.rent;
    await room.save();

    res.status(201).json({ data: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE user
router.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ data: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE user
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN (email/password)
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || user.password !== password)
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        roomAllocated: user.roomAllocated,
        phoneNumber: user.phoneNumber,
        feeStatus: user.feeStatus,
        detailPhotos: user.detailPhotos,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGOUT (dummy handler)
router.post("/logout", (req, res) => {
  req.session?.destroy?.(() => {
    res.status(200).json({ message: "Logout successful" });
  });
});

// CHANGE password — uses .save() so the pre-save hash hook runs
const rateLimit = require("../middleware/rateLimit");
router.post("/change-password", rateLimit({ windowMs: 60_000, max: 5 }), async (req, res) => {
  try {
    const { phone, oldPassword, newPassword } = req.body;
    if (!phone || !oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "phone, oldPassword and newPassword are required" });
    }
    const User = require("../models/User");
    const user = await User.findOne({ phone: Number(phone) });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    const ok = await user.comparePassword(oldPassword);
    if (!ok) return res.status(400).json({ success: false, message: "Current password is incorrect" });
    user.password = newPassword;
    await user.save();
    return res.json({ success: true, message: "Password updated" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.put("/accept-disclaimer/:id", async (req, res) => {
  await User.findByIdAndUpdate(req.params.id, {
    disclaimerAccepted: true,
    disclaimers: req.body.disclaimers,
  });

  res.json({ success: true });
});

module.exports = router;
