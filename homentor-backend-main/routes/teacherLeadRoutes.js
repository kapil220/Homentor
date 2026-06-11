const express = require("express");
const multer = require("multer");
const router = express.Router();
const TeacherLead = require("../models/TeacherLead");
const Mentor = require("../models/Mentor");
const PaymentScreenshot = require("../models/PaymentScreenshot");
const approveDemoBookingForLead = require("../utils/approveDemoBookingForLead");

const SCREENSHOT_PREFIX = "screenshot:";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype && file.mimetype.startsWith("image/")) return cb(null, true);
    cb(new Error("Only image uploads are allowed"));
  },
});

// Soft auth: requires x-mentor-phone header, resolves to mentor._id
async function resolveMentor(req, res) {
  const rawPhone = req.headers["x-mentor-phone"];
  if (!rawPhone) {
    res.status(401).json({ success: false, message: "Missing x-mentor-phone header" });
    return null;
  }
  const phone = String(rawPhone).replace(/\D/g, "");
  const mentor = await Mentor.findOne({ $or: [{ phone }, { phone: Number(phone) }] }).select("_id category commissionOverride commissionType teachingModes");
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

// GET /api/teacher-leads/unseen-count
// Returns count of leads the mentor hasn't seen yet (for sidebar badge).
router.get("/unseen-count", async (req, res) => {
  try {
    const mentor = await resolveMentor(req, res);
    if (!mentor) return;
    const count = await TeacherLead.countDocuments({ mentorId: mentor._id, seenByMentor: false });
    res.json({ success: true, count });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// PATCH /api/teacher-leads/mark-seen
// Marks all of this mentor's unseen leads as seen (called when Leads page opens).
router.patch("/mark-seen", async (req, res) => {
  try {
    const mentor = await resolveMentor(req, res);
    if (!mentor) return;
    await TeacherLead.updateMany({ mentorId: mentor._id, seenByMentor: false }, { seenByMentor: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// POST /api/teacher-leads/:id/pay
// Mentor submits payment. Accepts multipart/form-data with optional
// "screenshot" file and optional "paymentReference" UTR field, or
// JSON { paymentRef } for backwards compatibility. Sets paymentStatus
// to "submitted".
router.post(
  "/:id/pay",
  (req, res, next) => {
    upload.single("screenshot")(req, res, (err) => {
      if (!err) return next();
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({ success: false, message: "Image is too large. Please upload under 5 MB." });
      }
      return res.status(400).json({ success: false, message: err.message || "Invalid upload" });
    });
  },
  async (req, res) => {
    try {
      const mentor = await resolveMentor(req, res);
      if (!mentor) return;

      const paymentReference = (req.body.paymentReference || req.body.paymentRef || "").toString().trim();
      const file = req.file;

      if (!file && !paymentReference) {
        paymentReference = "sent-via-whatsapp";
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

      let paymentRef = paymentReference;
      if (file) {
        const shot = await PaymentScreenshot.create({
          leadId: lead._id,
          mentorPhone: String(req.headers["x-mentor-phone"]).replace(/\D/g, ""),
          contentType: file.mimetype,
          size: file.size,
          data: file.buffer,
        });
        paymentRef = `${SCREENSHOT_PREFIX}${shot._id}`;
      }

      lead.paymentRef = paymentRef;
      lead.paymentStatus = "submitted";
      await lead.save();

      res.json({ success: true, data: lead });
    } catch (err) {
      console.error("POST /teacher-leads/:id/pay error:", err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

// GET /api/teacher-leads/screenshot/:screenshotId
// Returns the raw image bytes. Auth: the mentor who owns the parent lead
// (x-mentor-phone) OR any caller presenting the admin header.
router.get("/screenshot/:screenshotId", async (req, res) => {
  try {
    const isAdmin = !!req.headers["x-admin-key"]; // matches the lightweight admin gating used elsewhere
    const rawPhone = req.headers["x-mentor-phone"];

    const shot = await PaymentScreenshot.findById(req.params.screenshotId);
    if (!shot) return res.status(404).json({ success: false, message: "Not found" });

    if (!isAdmin) {
      if (!rawPhone) return res.status(401).json({ success: false, message: "Unauthorized" });
      const phone = String(rawPhone).replace(/\D/g, "");
      if (shot.mentorPhone !== phone) {
        return res.status(403).json({ success: false, message: "Forbidden" });
      }
    }

    res.setHeader("Content-Type", shot.contentType);
    res.setHeader("Content-Length", shot.size);
    res.setHeader("Cache-Control", "private, max-age=300");
    res.send(shot.data);
  } catch (err) {
    console.error("GET /teacher-leads/screenshot/:id error:", err);
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

    // Cascade: push the linked demo booking into the mentor's Bookings section
    // (sets adminApproved: true). No-ops for call-only leads with no booking.
    try {
      await approveDemoBookingForLead(lead);
    } catch (cascadeErr) {
      console.error("approveDemoBookingForLead cascade failed:", cascadeErr);
    }

    res.json({ success: true, data: lead });
  } catch (err) {
    console.error("PUT /teacher-leads/admin/:id/approve error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
