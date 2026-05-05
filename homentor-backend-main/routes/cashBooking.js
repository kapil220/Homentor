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
      teachingMode,
    } = req.body;

    if (!amount || !customerPhone || !mentorId) {
      return res.status(400).json({ success: false, message: "amount, customerPhone, and mentorId are required" });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ success: false, message: "Mentor not found" });

    const parent = await User.findOne({ phone: Number(customerPhone) });
    if (!parent) return res.status(404).json({ success: false, message: "User not found. Please login first." });

    const resolvedTeachingMode =
      teachingMode === "online" || teachingMode === "offline"
        ? teachingMode
        : mentor.teachingMode === "both"
          ? "offline"
          : (mentor.teachingMode || "offline");

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
    const finalPrice = mentor?.teachingModes?.homeTuition?.finalPrice;
    const effectiveDuration = duration ? Number(duration) : 22;
    const perClassPrice = amount && effectiveDuration
      ? Number(amount) / effectiveDuration
      : (finalPrice
          ? finalPrice / effectiveDuration
          : (monthlyPrice ? monthlyPrice / effectiveDuration : undefined));

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
        currentPerClassPrice: perClassPrice,
        remainingClasses: effectiveDuration,
        paymentMethod: "cash",
        adminApproved: false,
        status: "pending_schedule",
        teachingMode: resolvedTeachingMode,
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
        currentPerClassPrice: perClassPrice,
        remainingClasses: effectiveDuration,
        paymentMethod: "cash",
        adminApproved: false,
        status: "pending_schedule",
        isDemo: !!isDemo,
        teachingMode: resolvedTeachingMode,
      });
    }

    await newBooking.save();

    order.classBookig = newBooking._id;
    await order.save();

    // Touch leads (non-blocking best-effort)
    // Touch leads (non-blocking best-effort) — only timestamp; don't touch enum status.
    try {
      const lead = await MentorLead.findOne({ phone: mentor.phone });
      if (lead) {
        lead.lastActivityText = "Cash booking pending approval";
        lead.lastActive = new Date();
        await lead.save();
      }
      const parentLead = await ParentLead.findOne({ phone: parent.phone });
      if (parentLead) {
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

/**
 * POST /api/cash-booking/manual
 * Body: { amount, customerPhone, mentorId, duration, session, isDemo, classBookingId, paymentReference }
 *
 * Same flow as /create but for manual UPI/bank-transfer bookings.
 * paymentMethod is "manual" and paymentReference holds the UTR/txn id submitted by the user.
 * Booking remains pending until admin verifies the transfer and approves.
 */
router.post("/manual", async (req, res) => {
  try {
    const {
      amount,
      customerPhone,
      mentorId,
      duration,
      session,
      isDemo,
      classBookingId,
      paymentReference,
      paymentScreenshot,
      teachingMode,
    } = req.body;

    if (!amount || !customerPhone || !mentorId) {
      return res.status(400).json({ success: false, message: "amount, customerPhone, and mentorId are required" });
    }
    if (!paymentReference && !paymentScreenshot) {
      return res.status(400).json({
        success: false,
        message: "Provide a transaction reference (UTR) or upload a payment screenshot.",
      });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ success: false, message: "Mentor not found" });

    const parent = await User.findOne({ phone: Number(customerPhone) });
    if (!parent) return res.status(404).json({ success: false, message: "User not found. Please login first." });

    const resolvedTeachingMode =
      teachingMode === "online" || teachingMode === "offline"
        ? teachingMode
        : mentor.teachingMode === "both"
          ? "offline"
          : (mentor.teachingMode || "offline");

    const orderId = `MANUAL_${uuidv4()}`;
    const order = await Order.create({
      orderId,
      mentor: mentor._id,
      parent: parent._id,
      amount,
      userPhone: String(customerPhone),
      status: "PENDING",
      paymentProvider: "manual",
      paymentMethod: "manual",
      paymentReference: paymentReference || "",
      paymentScreenshot: paymentScreenshot || "",
      duration: duration || null,
      session: session || 1,
      isDemo: !!isDemo,
      classBookig: classBookingId || undefined,
    });

    const margin = mentor?.teachingModes?.homeTuition?.margin;
    const monthlyPrice = mentor?.teachingModes?.homeTuition?.monthlyPrice;
    const finalPrice = mentor?.teachingModes?.homeTuition?.finalPrice;
    const effectiveDuration = duration ? Number(duration) : 22;
    const perClassPrice = amount && effectiveDuration
      ? Number(amount) / effectiveDuration
      : (finalPrice
          ? finalPrice / effectiveDuration
          : (monthlyPrice ? monthlyPrice / effectiveDuration : undefined));

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
        currentPerClassPrice: perClassPrice,
        remainingClasses: effectiveDuration,
        paymentMethod: "manual",
        paymentReference: paymentReference || "",
        paymentScreenshot: paymentScreenshot || "",
        adminApproved: false,
        status: "pending_schedule",
        teachingMode: resolvedTeachingMode,
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
        currentPerClassPrice: perClassPrice,
        remainingClasses: effectiveDuration,
        paymentMethod: "manual",
        paymentReference: paymentReference || "",
        paymentScreenshot: paymentScreenshot || "",
        adminApproved: false,
        status: "pending_schedule",
        isDemo: !!isDemo,
        teachingMode: resolvedTeachingMode,
      });
    }

    await newBooking.save();

    order.classBookig = newBooking._id;
    await order.save();

    // Touch leads (non-blocking best-effort).
    // NOTE: don't change `status` to a value outside the lead enum — that would silently
    // throw a Mongoose validation error. Only timestamp activity here.
    try {
      const lead = await MentorLead.findOne({ phone: mentor.phone });
      if (lead) {
        lead.lastActivityText = "Manual payment pending verification";
        lead.lastActive = new Date();
        await lead.save();
      }
      const parentLead = await ParentLead.findOne({ phone: parent.phone });
      if (parentLead) {
        parentLead.lastActivityText = "Manual payment pending verification";
        parentLead.lastActive = new Date();
        await parentLead.save();
      }
    } catch (e) {
      console.warn("manual-booking lead touch failed:", e.message);
    }

    return res.status(201).json({
      success: true,
      message: "Manual booking created. Awaiting admin verification of payment.",
      order,
      booking: newBooking,
    });
  } catch (err) {
    console.error("manual-booking create error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
