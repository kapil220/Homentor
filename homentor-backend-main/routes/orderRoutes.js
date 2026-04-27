const Order = require("../models/Order")
const express = require("express")
const verifyOwnerByPhone = require("../middleware/verifyOwnerByPhone")
const router = express.Router()

// ✅ Get all orders (admin use)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("mentor", "fullName phone")
      .populate("parent", "name phone");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Aggregate stats for the admin Orders page header tiles
router.get("/stats", async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const [paidAgg, pendingAgg, todayPaidAgg, todayCount, totalCount, byMethod] =
      await Promise.all([
        Order.aggregate([
          { $match: { status: "PAID" } },
          { $group: { _id: null, sum: { $sum: "$amount" } } },
        ]),
        Order.aggregate([
          { $match: { status: "PENDING" } },
          { $group: { _id: null, sum: { $sum: "$amount" } } },
        ]),
        Order.aggregate([
          { $match: { status: "PAID", createdAt: { $gte: startOfDay } } },
          { $group: { _id: null, sum: { $sum: "$amount" } } },
        ]),
        Order.countDocuments({ createdAt: { $gte: startOfDay } }),
        Order.countDocuments({}),
        Order.aggregate([
          { $group: { _id: "$paymentMethod", count: { $sum: 1 } } },
        ]),
      ]);

    res.json({
      totalRevenue: paidAgg[0]?.sum || 0,
      pendingAmount: pendingAgg[0]?.sum || 0,
      todayRevenue: todayPaidAgg[0]?.sum || 0,
      todayOrders: todayCount,
      totalOrders: totalCount,
      byMethod: byMethod.reduce((acc, b) => ({ ...acc, [b._id || "unknown"]: b.count }), {}),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders for a specific parent (student dashboard) — phone-gated
router.get("/by-parent/:parentId", verifyOwnerByPhone({ model: "User", paramKey: "parentId" }), async (req, res) => {
  try {
    const orders = await Order.find({ parent: req.params.parentId })
      .populate("mentor", "fullName phone profilePhoto")
      .sort({ createdAt: -1 });
    res.json({ data: orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Orders for a specific mentor (mentor earnings) — phone-gated
router.get("/by-mentor/:mentorId", verifyOwnerByPhone({ model: "Mentor", paramKey: "mentorId" }), async (req, res) => {
  try {
    const orders = await Order.find({ mentor: req.params.mentorId })
      .populate("parent", "name phone")
      .sort({ createdAt: -1 });
    res.json({ data: orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router