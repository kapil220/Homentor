const express = require("express");
const router = express.Router();
const CallIntent = require("../models/CallIntent");
const TeacherLead = require("../models/TeacherLead");
const Mentor = require("../models/Mentor");
const User = require("../models/User");
const resolveCommission = require("../utils/resolveCommission");

router.post("/create", async (req, res) => {
  try {
    const { parentPhone, mentorPhone, mentorId } = req.body;

    if (!parentPhone || !mentorPhone) {
      return res.status(400).json({
        success: false,
        message: "parentPhone and mentorPhone are required",
      });
    }

    const callIntent = await CallIntent.create({
      parentPhone,
      mentorPhone,
      mentorId: mentorId || null,
      status: "initiated",
    });

    // Upsert TeacherLead — one per parent-teacher pair
    if (mentorId) {
      try {
        const mentor = await Mentor.findById(mentorId).select("category commissionOverride");
        if (mentor) {
          const existingLead = await TeacherLead.findOne({ mentorId, parentPhone });

          if (existingLead) {
            existingLead.callCount += 1;
            existingLead.lastCalledAt = new Date();
            await existingLead.save();
          } else {
            const commissionAmount = await resolveCommission(mentor);

            let parentName = "";
            let parentClass = "";
            let parentSubjects = "";
            let parentCity = "";
            let parentArea = "";

            const user = await User.findOne({
              $or: [{ phone: Number(parentPhone) }, { phone: parentPhone }],
            }).select("parentName children address");

            if (user) {
              parentName = user.parentName || "";
              const firstChild = Array.isArray(user.children) ? user.children[0] : null;
              if (firstChild) {
                parentClass = firstChild.class || firstChild.grade || firstChild.className || "";
                parentSubjects = Array.isArray(firstChild.subjects)
                  ? firstChild.subjects.join(", ")
                  : firstChild.subjects || "";
              }
              const addr = user.address || {};
              parentCity = addr.city || "";
              parentArea = addr.area || "";
            }

            await TeacherLead.create({
              mentorId,
              parentPhone,
              parentName,
              parentClass,
              parentSubjects,
              parentLocation: { city: parentCity, area: parentArea },
              commissionAmount,
              commissionPaid: commissionAmount === 0,
              paymentStatus: commissionAmount === 0 ? "approved" : "pending",
            });
          }
        }
      } catch (leadErr) {
        console.error("TeacherLead upsert error:", leadErr);
      }
    }

    return res.status(201).json({
      success: true,
      data: callIntent,
    });
  } catch (error) {
    console.error("Create CallIntent Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create call intent",
    });
  }
});

/**
 * 🔹 Get Call Intent by Parent Phone
 * Used by Exotel webhook to validate call
 */
router.get("/by-parent/:phone", async (req, res) => {
  try {
    const { phone } = req.params;

    const callIntent = await CallIntent.findOne({
      parentPhone: phone,
    }).sort({ createdAt: -1 });

    if (!callIntent) {
      return res.status(404).json({
        success: false,
        message: "Call intent not found or expired",
      });
    }

    return res.json({
      success: true,
      data: callIntent,
    });
  } catch (error) {
    console.error("Fetch CallIntent Error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching call intent",
    });
  }
});

/**
 * 🔹 Update Call Status
 * Used after Exotel callback (connected / missed / failed)
 */
router.patch("/status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatus = ["initiated", "connected", "missed", "failed"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    const updatedIntent = await CallIntent.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedIntent) {
      return res.status(404).json({
        success: false,
        message: "Call intent not found",
      });
    }

    return res.json({
      success: true,
      data: updatedIntent,
    });
  } catch (error) {
    console.error("Update CallIntent Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update call status",
    });
  }
});

/**
 * 🔹 Admin / Debug: Get all call intents
 */
router.get("/all", async (req, res) => {
  try {
    const filter = {};
    if (req.query.mode === "direct" || req.query.mode === "exotel") {
      filter.mode = req.query.mode;
    }
    const intents = await CallIntent.find(filter).populate("mentorId", "fullName")
      .sort({ createdAt: -1 })
      .limit(200);

    return res.json({
      success: true,
      count: intents.length,
      data: intents,
    });
  } catch (error) {
    console.error("Fetch All CallIntents Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch call intents",
    });
  }
});

module.exports = router;
