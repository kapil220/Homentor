const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const { sendEvent: sendWhatsappEvent } = require("../utils/whatsappService");

const fireWhatsappPassword = (phone, name, password) => {
  if (!phone || !password) return;
  const waTo = String(phone).replace(/\D/g, "").slice(-10);
  if (waTo.length !== 10) return;
  sendWhatsappEvent("password_share", { to: `91${waTo}`, name, password }).catch(() => {});
};

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
      existing.passwordPlain = password;
      doc = await existing.save();
    } else if (userType === "mentor") {
      doc = await Mentor.create({
        phone: phone,
        password,
        passwordPlain: password,
        fullName: fullName || `Mentor ${phone}`,
      });
    } else {
      doc = await User.create({
        phone: Number(phone),
        password,
        passwordPlain: password,
      });
    }

    fireWhatsappPassword(phone, doc.fullName || doc.parentName, password);
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

    if (userType === "mentor" && doc.status !== "Approved") {
      return res.status(403).json({
        success: false,
        message: doc.status === "Rejected"
          ? "Your mentor application has been rejected. Please contact support."
          : "Your account is pending admin approval. You'll be notified once approved.",
      });
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
    doc.passwordPlain = password;
    await doc.save();
    fireWhatsappPassword(phone, doc.fullName || doc.parentName, password);
    return res.json({ success: true });
  } catch (err) {
    console.error("set-password error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Admin-only: forcibly set or reset a user's password by id.
// userType is required so we can disambiguate User vs Mentor when the same id space is not shared.
router.post("/admin/reset-password", async (req, res) => {
  try {
    const { userId, userType, password } = req.body;
    if (!userId || !userType || !password) {
      return res.status(400).json({ success: false, message: "userId, userType and password are required" });
    }
    if (!["student", "mentor"].includes(userType)) {
      return res.status(400).json({ success: false, message: "Invalid userType" });
    }
    const Model = userType === "mentor" ? Mentor : User;
    const doc = await Model.findById(userId);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });
    doc.password = password;
    doc.passwordPlain = password;
    await doc.save();
    fireWhatsappPassword(doc.phone, doc.fullName || doc.parentName, password);
    return res.json({ success: true });
  } catch (err) {
    console.error("admin reset-password error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Admin-only: update name/email/phone (NOT password) for a User or Mentor.
// Password changes go through /admin/reset-password so hashing + WhatsApp stay in one place.
router.put("/admin/update-credentials", async (req, res) => {
  try {
    const { userId, userType, name, email, phone } = req.body;
    if (!userId || !userType) {
      return res.status(400).json({ success: false, message: "userId and userType are required" });
    }
    if (!["student", "mentor"].includes(userType)) {
      return res.status(400).json({ success: false, message: "Invalid userType" });
    }
    const Model = userType === "mentor" ? Mentor : User;
    const doc = await Model.findById(userId);
    if (!doc) return res.status(404).json({ success: false, message: "Not found" });

    // Phone change: normalize per model type and reject collisions.
    if (phone !== undefined && phone !== null && String(phone).trim() !== "" && String(phone) !== String(doc.phone)) {
      const normalizedPhone = userType === "mentor" ? String(phone) : Number(phone);
      const existing = await Model.findOne({ phone: normalizedPhone });
      if (existing && String(existing._id) !== String(doc._id)) {
        return res.status(409).json({ success: false, message: "Phone already in use" });
      }
      doc.phone = normalizedPhone;
    }

    if (name !== undefined) {
      if (userType === "mentor") doc.fullName = name;
      else doc.parentName = name;
    }
    if (email !== undefined) doc.email = email;

    await doc.save();
    return res.json({ success: true });
  } catch (err) {
    console.error("admin update-credentials error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
