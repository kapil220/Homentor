const express = require("express");
const DemoBooking = require("../models/DemoBooking");
const User = require("../models/User");
const ClassBooking = require("../models/ClassBooking");
const MentorLead = require("../models/MentorLead");
const ParentLead = require("../models/ParentLead");
const Mentor = require("../models/Mentor");
const TeacherLead = require("../models/TeacherLead");
const resolveCommission = require("../utils/resolveCommission");

const router = express.Router();


// ✅ Create demo booking
router.post("/", async (req, res) => {
  try {
    console.log(req.body);

    const { mentorId, parentPhone, studentName, address, fee } = req.body;

    // Save demo booking
    const booking = await DemoBooking.create({
      mentor: mentorId,
      parentPhone,
      studentName,
      address,
      fee
    });

    // Find or create parent
    let parent = await User.findOne({ phone: parentPhone });

    if (!parent) {
      parent = await User.create({ phone: parentPhone });
    }

    // Create main class booking
    const newBooking = await ClassBooking.create({
      mentor: mentorId,
      price: 0,
      parent: parent._id,
      duration: 2,
      isDemo: true,
      demoStatus: "running"
    });

    let lead = req.body.mentorPhone
      ? await MentorLead.findOne({ phone: req.body.mentorPhone })
      : null

    if (lead) {
      lead.demoBooked = true
      lead.status = "demo_booked"
      await lead.save()
    }

    let parentLead = await ParentLead.findOne({
      phone: parentPhone
    })
    if (parentLead) {
      parentLead.demoBooked = true
      parentLead.status = "demo_booked"
      parentLead.lastActive = new Date(),
      parentLead.lastActivityText = "Demo Booking"
      await parentLead.save()
    }

    // Upsert TeacherLead so the booking appears on the teacher's Leads tab
    // immediately, locked until they pay the platform commission.
    try {
      const mentor = await Mentor.findById(mentorId).select("category commissionOverride commissionType teachingModes");
      if (mentor) {
        const existingLead = await TeacherLead.findOne({ mentorId, parentPhone });
        if (existingLead) {
          existingLead.lastCalledAt = new Date();
          await existingLead.save();
        } else {
          const commissionAmount = await resolveCommission(mentor);

          let parentName = "";
          let parentClass = "";
          let parentSubjects = "";
          let parentCity = "";
          let parentArea = "";

          const userDoc = await User.findOne({
            $or: [{ phone: Number(parentPhone) }, { phone: parentPhone }],
          }).select("parentName children address");

          if (userDoc) {
            parentName = userDoc.parentName || studentName || "";
            const firstChild = Array.isArray(userDoc.children) ? userDoc.children[0] : null;
            if (firstChild) {
              parentClass = firstChild.class || firstChild.grade || firstChild.className || "";
              parentSubjects = Array.isArray(firstChild.subjects)
                ? firstChild.subjects.join(", ")
                : firstChild.subjects || "";
            }
            const addr = userDoc.address || {};
            parentCity = addr.city || "";
            parentArea = addr.area || (typeof address === "string" ? address : "");
          } else {
            parentName = studentName || "";
            parentArea = typeof address === "string" ? address : "";
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
      console.error("TeacherLead upsert from demo booking failed:", leadErr);
    }

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: {
        demoBooking: booking,
        classBooking: newBooking,
      },
    });

  } catch (error) {
    console.error("Booking error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// ✅ Get all demo bookings (for admin)
router.get("/", async (req, res) => {
  try {
    const bookings = await DemoBooking.find()
      .populate("mentor", "fullName phone profilePhoto")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Update status of a demo booking
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await DemoBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ✅ Delete a booking (optional)
router.delete("/:id", async (req, res) => {
  try {
    await DemoBooking.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
