const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Mentor = require("../models/Mentor");

const normalizePhone = (mobile) => {
  if (mobile === undefined || mobile === null) return null;
  const digits = String(mobile).replace(/\D/g, "").slice(-10);
  return digits.length === 10 ? digits : null;
};

const modelFor = (userType) => (userType === "mentor" ? Mentor : User);

const findByPhone = async (userType, phone) => {
  if (userType === "mentor") {
    return Mentor.findOne({ phone: String(phone) });
  }
  return User.findOne({ phone: Number(phone) });
};

router.post("/signup", async (req, res) => {
  try {
    const { mobile, password, userType, fullName } = req.body;
    const phone = normalizePhone(mobile);
    if (!phone || !password || !userType) {
      return res.status(400).json({ success: false, message: "mobile, password and userType are required" });
    }
    if (!["student", "mentor"].includes(userType)) {
      return res.status(400).json({ success: false, message: "Invalid userType" });
    }

    const otherType = userType === "mentor" ? "student" : "mentor";
    const otherExisting = await findByPhone(otherType, phone);
    if (otherExisting && otherExisting.password) {
      return res.status(409).json({
        success: false,
        message: `This number is already registered as a ${otherType}. One account per number.`,
      });
    }

    const existing = await findByPhone(userType, phone);
    if (existing && existing.password) {
      return res.status(409).json({ success: false, message: "Account already exists. Please login." });
    }

    let doc;
    if (existing) {
      existing.password = password;
      doc = await existing.save();
    } else if (userType === "mentor") {
      doc = await Mentor.create({
        phone: phone,
        password,
        fullName: fullName || `Mentor ${phone}`,
      });
    } else {
      doc = await User.create({
        phone: Number(phone),
        password,
      });
    }

    const safe = doc.toObject();
    delete safe.password;
    return res.status(201).json({ success: true, user: safe, userType });
  } catch (err) {
    console.error("signup error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { mobile, password, userType } = req.body;
    const phone = normalizePhone(mobile);
    if (!phone || !password || !userType) {
      return res.status(400).json({ success: false, message: "mobile, password and userType are required" });
    }

    const doc = await findByPhone(userType, phone);
    if (!doc) {
      return res.status(404).json({ success: false, message: "No account found. Please sign up." });
    }
    if (!doc.password) {
      return res.status(403).json({ success: false, message: "Password not set for this account. Please sign up to set a password." });
    }

    const ok = await doc.comparePassword(password);
    if (!ok) {
      return res.status(401).json({ success: false, message: "Invalid password" });
    }

    const safe = doc.toObject();
    delete safe.password;
    return res.json({ success: true, user: safe, userType });
  } catch (err) {
    console.error("login error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

router.post("/set-password", async (req, res) => {
  try {
    const { mobile, password, userType } = req.body;
    const phone = normalizePhone(mobile);
    if (!phone || !password || !userType) {
      return res.status(400).json({ success: false, message: "mobile, password and userType are required" });
    }

    const doc = await findByPhone(userType, phone);
    if (!doc) {
      return res.status(404).json({ success: false, message: "No account found" });
    }
    if (doc.password) {
      return res.status(409).json({ success: false, message: "Password already set" });
    }

    doc.password = password;
    await doc.save();
    return res.json({ success: true });
  } catch (err) {
    console.error("set-password error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
