const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const ClassBooking = require("../models/ClassBooking");
const Mentor = require("../models/Mentor");
const CallLog = require("../models/CallLog");
const Order = require("../models/Order");
const User = require("../models/User");
const MentorLead = require("../models/MentorLead");
const ParentLead = require("../models/ParentLead");
const CallIntent = require("../models/CallIntent");

// GET admin by ID
router.get("/:id", async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ data: admin });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// CREATE new admin (Admin can create students)
router.post("/", async (req, res) => {
  try {

    // Create a new Admin
    const newAdmin = new Admin(req.body);

    // Save the new admin to the database
    const savedAdmin = await newAdmin.save();
    res.status(201).json({ data: savedAdmin });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// UPDATE admin (Admin can update admin details)
router.put("/:id", async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ data: updatedAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// DELETE admin (Admin can delete a student)
router.delete("/:id", async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// LOGIN route (for student login)
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Compare plain text password with stored password
    if (admin.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Successfully logged in
    res.status(200).json({
      message: "Login successful",
      admin: admin,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGOUT route (student logout)
router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Failed to logout" });
    }
    res.status(200).json({ message: "Logout successful" });
  });
});

router.get("/", async (req, res) => {
  try {
    const bookings = await ClassBooking.countDocuments({
      isViewedByAdmin: false,
    });
    const calls = await CallLog.countDocuments({
      isViewedByAdmin: false,
    });

    const mentorRequests = await Mentor.countDocuments({
      isViewedByAdmin: false,
    });

    // Always return the most recently saved admin config first so the
    // public site / booking flow reflects the latest payment settings,
    // even if multiple Admin docs exist in the DB.
    let configs = await Admin.find().sort({ _id: -1 });
    if (configs.length === 0) {
      const created = await Admin.create({});
      configs = [created];
    }

    // ----- Dashboard aggregates -----
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const closedLeadStatuses = ["paid_booking"]; // open = anything not yet converted

    const [
      pendingApprovals,
      totalMentors,
      activeMentors,
      totalUsers,
      todayPaidAgg,
      todayOrdersCount,
      pendingPaidAgg,
      mentorLeadsOpen,
      parentLeadsOpen,
      todayCalls,
    ] = await Promise.all([
      ClassBooking.countDocuments({ adminApproved: false, status: "pending_schedule" }),
      Mentor.countDocuments({}),
      Mentor.countDocuments({ showOnWebsite: true }),
      User.countDocuments({}),
      Order.aggregate([
        { $match: { status: "PAID", createdAt: { $gte: startOfDay } } },
        { $group: { _id: null, sum: { $sum: "$amount" } } },
      ]),
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      Order.aggregate([
        { $match: { status: "PENDING" } },
        { $group: { _id: null, sum: { $sum: "$amount" } } },
      ]),
      MentorLead.countDocuments({ status: { $nin: closedLeadStatuses } }),
      ParentLead.countDocuments({ status: { $nin: closedLeadStatuses } }),
      CallIntent.countDocuments({ createdAt: { $gte: startOfDay } }),
    ]);

    res.json({
      data: configs,
      // legacy counts (kept for sidebar badges)
      bookings,
      calls,
      mentorRequests,
      // new dashboard fields
      pendingApprovals,
      totalMentors,
      activeMentors,
      totalUsers,
      todayRevenue: todayPaidAgg[0]?.sum || 0,
      todayOrders: todayOrdersCount,
      pendingPaymentAmount: pendingPaidAgg[0]?.sum || 0,
      mentorLeadsOpen,
      parentLeadsOpen,
      todayCalls,
    });

  } catch (error) {
    console.error("❌ Sidebar-counts error:", error);

    res.status(500).json({
      message: "Sidebar counts failed",
      error: error.message,
    });
  }
});



module.exports = router;
