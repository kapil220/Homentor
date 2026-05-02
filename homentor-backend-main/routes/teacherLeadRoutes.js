const express = require("express");
const router = express.Router();
const TeacherLead = require("../models/TeacherLead");
const Mentor = require("../models/Mentor");

// Soft auth: requires x-mentor-phone header, resolves to mentor._id
async function resolveMentor(req, res) {
  const rawPhone = req.headers["x-mentor-phone"];
  if (!rawPhone) {
    res.status(401).json({ success: false, message: "Missing x-mentor-phone header" });
    return null;
  }
  const phone = String(rawPhone).replace(/\D/g, "");
  const mentor = await Mentor.findOne({ $or: [{ phone }, { phone: Number(phone) }] }).select("_id category commissionOverride");
  if (!mentor) {
    res.status(403).json({ success: false, message: "Mentor not found" });
    return null;
  }
  return mentor;
}

// GET /api/teacher-leads/mine
// Returns teacher's leads. Phone + location stripped if commissionPaid: false.
router.get("/mine", async (req, res) => {
  try {
    const mentor = await resolveMentor(req, res);
    if (!mentor) return;

    const leads = await TeacherLead.find({ mentorId: mentor._id }).sort({ lastCalledAt: -1 });

    const masked = leads.map((lead) => {
      const obj = lead.toObject();
      if (!obj.commissionPaid) {
        obj.parentPhone = null;
        obj.parentLocation = null;
      }
      return obj;
    });

    res.json({ success: true, data: masked });
  } catch (err) {
    console.error("GET /teacher-leads/mine error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/teacher-leads/:id/pay
// Teacher submits payment screenshot; sets paymentStatus to "submitted"
router.post("/:id/pay", async (req, res) => {
  try {
    const mentor = await resolveMentor(req, res);
    if (!mentor) return;

    const { paymentRef } = req.body;
    if (!paymentRef) {
      return res.status(400).json({ success: false, message: "paymentRef (screenshot URL) is required" });
    }

    const lead = await TeacherLead.findOne({ _id: req.params.id, mentorId: mentor._id });
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    if (lead.commissionPaid) {
      return res.status(400).json({ success: false, message: "Lead already unlocked" });
    }
    if (lead.paymentStatus === "submitted") {
      return res.status(400).json({ success: false, message: "Payment already submitted, awaiting admin review" });
    }

    lead.paymentRef = paymentRef;
    lead.paymentStatus = "submitted";
    await lead.save();

    res.json({ success: true, data: lead });
  } catch (err) {
    console.error("POST /teacher-leads/:id/pay error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET /api/teacher-leads/admin/pending
// Admin: list all leads with paymentStatus "submitted"
router.get("/admin/pending", async (req, res) => {
  try {
    const leads = await TeacherLead.find({ paymentStatus: "submitted" })
      .populate("mentorId", "fullName phone category")
      .sort({ updatedAt: -1 });
    res.json({ success: true, data: leads });
  } catch (err) {
    console.error("GET /teacher-leads/admin/pending error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PUT /api/teacher-leads/admin/:id/approve
// Admin: approve payment, unlock lead
router.put("/admin/:id/approve", async (req, res) => {
  try {
    const lead = await TeacherLead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, message: "Lead not found" });
    }
    if (lead.paymentStatus !== "submitted") {
      return res.status(400).json({ success: false, message: "Lead has not submitted payment yet" });
    }
    lead.commissionPaid = true;
    lead.paymentStatus = "approved";
    await lead.save();
    res.json({ success: true, data: lead });
  } catch (err) {
    console.error("PUT /teacher-leads/admin/:id/approve error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
