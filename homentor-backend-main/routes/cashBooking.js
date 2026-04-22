const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const Order = require("../models/Order");
const ClassBooking = require("../models/ClassBooking");
const Mentor = require("../models/Mentor");
const User = require("../models/User");
const MentorLead = require("../models/MentorLead");
const ParentLead = require("../models/ParentLead");

/**
 * POST /api/cash-booking/create
 * Body: { amount, customerPhone, mentorId, duration, session, isDemo, classBookingId }
 *
 * Creates an Order (paymentMethod: cash, status: PAID) and a ClassBooking
 * with status "pending_schedule" and adminApproved=false. Admin must approve
 * via existing POST /api/class-bookings/:id/admin-approve to activate.
 */
router.post("/create", async (req, res) => {
  try {
    const {
      amount,
      customerPhone,
      mentorId,
      duration,
      session,
      isDemo,
      classBookingId,
    } = req.body;

    if (!amount || !customerPhone || !mentorId) {
      return res.status(400).json({ success: false, message: "amount, customerPhone, and mentorId are required" });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ success: false, message: "Mentor not found" });

    const parent = await User.findOne({ phone: Number(customerPhone) });
    if (!parent) return res.status(404).json({ success: false, message: "User not found. Please login first." });

    const orderId = `CASH_${uuidv4()}`;
    const order = await Order.create({
      orderId,
      mentor: mentor._id,
      parent: parent._id,
      amount,
      userPhone: String(customerPhone),
      status: "PAID",
      paymentProvider: "cash",
      paymentMethod: "cash",
      duration: duration || null,
      session: session || 1,
      isDemo: !!isDemo,
      classBookig: classBookingId || undefined,
      verifiedAt: new Date(),
    });

    const margin = mentor?.teachingModes?.homeTuition?.margin;
    const monthlyPrice = mentor?.teachingModes?.homeTuition?.monthlyPrice;
    const effectiveDuration = duration ? Number(duration) : 22;

    let newBooking;
    if (classBookingId) {
      const oldClassBooking = await ClassBooking.findById(classBookingId);
      if (oldClassBooking) {
        oldClassBooking.sessionContinued = true;
        await oldClassBooking.save();
      }
      newBooking = new ClassBooking({
        mentor: mentor._id,
        price: amount,
        parent: parent._id,
        duration: effectiveDuration,
        session: session || 1,
        commissionPrice: margin,
        currentPerClassPrice: monthlyPrice ? monthlyPrice / effectiveDuration : undefined,
        remainingClasses: effectiveDuration,
        paymentMethod: "cash",
        adminApproved: false,
        status: "pending_schedule",
      });
      if (oldClassBooking) {
        newBooking.class = oldClassBooking.class;
        newBooking.studentName = oldClassBooking.studentName;
        newBooking.school = oldClassBooking.school;
        newBooking.scheduledTime = oldClassBooking.scheduledTime;
        newBooking.scheduledDate = oldClassBooking.scheduledDate;
        newBooking.subject = oldClassBooking.subject;
      }
      newBooking.isDemo = !!isDemo;
    } else {
      newBooking = new ClassBooking({
        mentor: mentor._id,
        price: amount,
        parent: parent._id,
        duration: effectiveDuration,
        session: session || 1,
        commissionPrice: margin,
        currentPerClassPrice: monthlyPrice ? monthlyPrice / effectiveDuration : undefined,
        remainingClasses: effectiveDuration,
        paymentMethod: "cash",
        adminApproved: false,
        status: "pending_schedule",
        isDemo: !!isDemo,
      });
    }

    await newBooking.save();

    order.classBookig = newBooking._id;
    await order.save();

    // Touch leads (non-blocking best-effort)
    try {
      const lead = await MentorLead.findOne({ phone: mentor.phone });
      if (lead) {
        lead.status = "cash_booking_pending";
        lead.lastActivityText = "Cash booking pending approval";
        lead.lastActive = new Date();
        await lead.save();
      }
      const parentLead = await ParentLead.findOne({ phone: parent.phone });
      if (parentLead) {
        parentLead.status = "cash_booking_pending";
        parentLead.lastActivityText = "Cash booking pending approval";
        parentLead.lastActive = new Date();
        await parentLead.save();
      }
    } catch (e) {
      console.warn("cash-booking lead touch failed:", e.message);
    }

    return res.status(201).json({
      success: true,
      message: "Cash booking created. Awaiting admin approval.",
      order,
      booking: newBooking,
    });
  } catch (err) {
    console.error("cash-booking create error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
