const express = require("express");
const router = express.Router();
const ClassRecord = require("../models/ClassRecord");
const ClassBooking = require("../models/ClassBooking");
const logMentorActivity = require("../utils/logMentorActivity");

// GET all classRecords
router.get("/", async (req, res) => {
  try {
    const classRecords = await ClassRecord.find()
    res.status(200).json({ data: classRecords });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/class-booking/:id", async (req, res) => {
  try {
    const classRecords = await ClassRecord.find({
        classBooking : req.params.id
    }).populate("mentor", "fullName")
    res.status(200).json({ data: classRecords });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const classRecords = await ClassRecord.findByIdAndUpdate(req.params.id, req.body)
    res.status(200).json({ data: classRecords });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    console.log(req.body);

    // 1️⃣ Save class record first
    const classRecord = new ClassRecord(req.body);
    await classRecord.save();

    // 2️⃣ Fetch ClassBooking
    let classBooking = await ClassBooking.findOne({
      _id: classRecord.classBooking
    });

    if (!classBooking) {
      return res.status(404).json({ message: "Class Booking not found" });
    }

    // Ensure progress exists (old bookings may have null or undefined)
    if (!classBooking.progress) {
      classBooking.progress = 0;
    }

    // 3️⃣ Convert duration "H:MM" → total minutes
    const durationStr = req.body.duration;   // example "1:10"
    let [hours, minutes] = durationStr.split(":").map(Number);
    const totalMinutes = hours * 60 + minutes;

    // 4️⃣ Add the minutes to progress
    classBooking.progress += totalMinutes;

    // 5️⃣ Push class record
    classBooking.classesRecord.push(classRecord._id);
    classBooking.status = "running"

    // 6️⃣ Save booking
    await classBooking.save();

    await logMentorActivity(classRecord.mentor, "Attendance Marked");

    // G5: when the attendance chart hits the booked total duration, prompt the
    // parent over WhatsApp with next-month payment details. Idempotent via
    // bookingPaymentReminderSent flag so re-saves don't re-spam.
    try {
      const totalRequired = Number(classBooking.duration || 0) * 60;
      if (
        totalRequired > 0 &&
        classBooking.progress >= totalRequired &&
        !classBooking.bookingPaymentReminderSent &&
        !classBooking.isDemo
      ) {
        const User = require("../models/User");
        const Mentor = require("../models/Mentor");
        const { sendEvent } = require("../utils/whatsappService");
        const parent = await User.findById(classBooking.parent).lean();
        const mentor = await Mentor.findById(classBooking.mentor).lean();
        const parentPhone = parent?.phone ? `91${String(parent.phone).slice(-10)}` : null;
        const monthlyPrice = mentor?.teachingModes?.homeTuition?.finalPrice || classBooking.price;
        const baseUrl = process.env.FRONTEND_URL || "https://hommentor.in";
        const paymentLink = `${baseUrl}/dashboard/student?rebook=${classBooking._id}`;
        const studentName = classBooking.studentName || parent?.parentName || "Student";
        const monthName = new Date().toLocaleString("en-IN", { month: "long", year: "numeric" });
        if (parentPhone) {
          sendEvent("attendance_payment_link", {
            to: parentPhone,
            studentName,
            monthName,
            amount: monthlyPrice,
            paymentLink,
          }).catch(() => {});
        }
        classBooking.bookingPaymentReminderSent = true;
        await classBooking.save();
      }
    } catch (e) {
      console.warn("G5 payment reminder failed:", e?.message);
    }

    res.status(200).json({ data: classRecord });

  } catch (error) {
    console.error("Error saving class record:", error);
    res.status(500).json({ message: error.message || "Something went wrong" });
  }
});



module.exports = router