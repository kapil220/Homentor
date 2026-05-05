const express = require("express");
const router = express.Router();
const Mentor = require("../models/Mentor");
const MentorLead = require("../models/MentorLead");
const MarginRule = require("../models/MarginRule");
const logMentorActivity = require("../utils/logMentorActivity");

router.get("/nearby-mentors", async (req, res) => {
  const { lat, lon, subject, classLevel, rank, mode } = req.query;
  const adminLat = Number(lat);
  const adminLon = Number(lon);
  const mentorQuery = {};
  if (mode === "online" || mode === "offline") {
    mentorQuery.teachingMode = { $in: [mode, "both"] };
  }
  const mentors = await Mentor.find(mentorQuery);

  // Convert teaching range "5km" / "25km+" / "anywhere"
  function normalizeRange(range) {
    if (!range) return Infinity;

    let r = range.toLowerCase();

    if (r === "anywhere") return Infinity;
    if (r.endsWith("+")) return parseInt(r); // "25km+" → 25

    return parseInt(r); // "5km" → 5
  }

  // Distance calculator (Haversine)
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

    return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
  }

  let enriched = mentors.map(m => {
    const distance = getDistance(
      adminLat,
      adminLon,
      m.location?.lat,
      m.location?.lon
    );

    const numericRange = normalizeRange(m.teachingRange);
    const isInRange = distance <= numericRange;

    // ---------------------------
    // CLASS & SUBJECT FILTER LOGIC
    // ---------------------------

    let isClassMatch = true;
    let isSubjectMatch = true;

    const prefs = m.teachingPreferences?.school || {};

    // If class filter applied
    if (classLevel) {
      const classKey = String(classLevel).toLowerCase();

      isClassMatch = Object.keys(prefs)
        .map(k => k.toLowerCase())
        .includes(classKey);
    }

    // If subject filter applied
    if (subject && classLevel) {
      const subjects = prefs[classLevel] || [];

      isSubjectMatch = subjects
        .map(s => s.toLowerCase())
        .includes(subject.toLowerCase());
    }

    // RANK FILTER
    const isRankMatch = rank ? Number(m.adminRanking) === Number(rank) : true;

    const strongMatch =
      isClassMatch &&
      isSubjectMatch &&
      isRankMatch;

    return {
      ...m._doc,
      distance,
      convertedRange: numericRange,
      isInRange,
      isClassMatch,
      isSubjectMatch,
      isRankMatch,
      strongMatch,
    };
  });

  // FINAL SORTING PRIORITY
  enriched.sort((a, b) => {
    // 1️⃣ Strong match first (class + subject + rank)
    if (a.strongMatch && !b.strongMatch) return -1;
    if (!a.strongMatch && b.strongMatch) return 1;

    // 2️⃣ In teaching range
    if (a.isInRange && !b.isInRange) return -1;
    if (!a.isInRange && b.isInRange) return 1;

    // 3️⃣ Available mentors first
    if (a.isAvailable && !b.isAvailable) return -1;
    if (!a.isAvailable && b.isAvailable) return 1;

    // 4️⃣ Nearest first
    return a.distance - b.distance;
  });

  res.json(enriched);
});

// GET all mentors
router.get("/", async (req, res) => {
  try {
    const mentors = await Mentor.find()
    res.status(200).json({ data: mentors });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update all mentors demoType at once
router.put("/demoType/:type", async (req, res) => {
  try {
    const { type } = req.params;
    if (!["free", "paid", "none"].includes(type)) {
      return res.status(400).json({ message: "Invalid demoType" });
    }
    await Mentor.updateMany({}, { demoType: type });
    res.json({ message: `All mentors updated to demoType: ${type}` });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/login-check", async (req, res) => {
  try {
    console.log(req.body.phone)
    const mentor = await Mentor.findOne({ phone: req.body.phone })
    await logMentorActivity(mentor._id, "Logged in");
    if (!mentor) {
      res.status(404).json({ message: "Mentor not found" });
    }
    res.status(200).json({ data: mentor });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get('/selected-mentors', async (req, res) => {
  try {
    const idsParam = req.query.id;
    if (!idsParam) return res.status(400).json({ error: 'No IDs provided' });

    const idsArray = idsParam.split(',').map((id) => id.trim());

    // Assuming you're using Mongoose and your model is Mentor
    const mentors = await Mentor.find({ _id: { $in: idsArray } });

    res.json({ mentors });
  } catch (err) {
    console.error('Error fetching mentors:', err);
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
});

router.get('/pending-mentors', async (req, res) => {
  const pendingMentors = await Mentor.find({
    status: "Pending"
  })
  res.status(200).json({ data: pendingMentors })
})

router.get('/rejected-mentors', async (req, res) => {
  const rejectedMentors = await Mentor.find({
    status: "Rejected"
  })
  res.status(200).json({ data: rejectedMentors })
})

router.get('/approved-mentors', async (req, res) => {
  const pendingMentors = await Mentor.find({
    status: "Approved"
  })
  res.status(200).json({ data: pendingMentors })
})

router.get('/visible-mentors', async (req, res) => {
  try {

    const { lat, lon, city } = req.query;

    const hasLocation = lat && lon;

    /* ===============================
       📍 CASE 1: Exact Location
    =============================== */
    if (hasLocation) {
      const variant = Math.random() < 0.5 ? "A" : "B";

      const pipeline = buildRecommendationPipeline({
        parentLat: Number(lat),
        parentLon: Number(lon),
        parentCity: city,
        variant,
      });

      const result = await Mentor.aggregate(pipeline);

      const mentors = result[0]?.mentors || [];

      await Mentor.updateMany(
        { _id: { $in: mentors.map((m) => m._id) } },
        { $set: { lastShownAt: new Date() } }
      );

      return res.json({
        success: true,
        count: mentors.length,
        mentors,
        mode: "geo",
      });
    }

    /* ===============================
       🏙 CASE 2: City Only
    =============================== */
    if (city) {
      const mentors = await Mentor.find({
        "location.city": city,
        isActive: true,
      })
        .sort({ rating: -1, lastShownAt: 1 })
        .limit(8);

      return res.json({
        success: true,
        count: mentors.length,
        mentors,
        mode: "city",
      });
    }

    /* ===============================
       ⭐ CASE 3: No Info → Default
    =============================== */
    const mentors = await Mentor.find({
      status: "Approved",
      showOnWebsite: true
    })
      .sort({ rating: -1, lastShownAt: 1 })
      .limit(8);

    res.json({
      success: true,
      count: mentors.length,
      mentors,
      mode: "default",
    });

  } catch (error) {
    console.error("Mentor recommendation error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }

})

router.get('/gold-mentor', async (req, res) => {
  const goldMentors = await Mentor.find({
    status: "Approved",
    showOnWebsite: true,
    inHouse: true
  })
  res.status(200).json({ data: goldMentors })
})

router.get("/:id", async (req, res) => {
  try {
    const mentor = await Mentor.findById(req.params.id).populate("student", "name email");
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }
    res.status(200).json({ data: mentor });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/batch", async (req, res) => {
  try {
    const mentorIds = req.body.ids;   // receives ["id1", "id2", "id3"]

    const mentors = await Mentor.find({
      _id: { $in: mentorIds }
    }).select("fullName phone profilePhoto teachingModes phone");

    res.json({ success: true, mentors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    // ✅ 1. Normalize mobile number (last 10 digits only)
    if (req.body.phone) {
      const digitsOnly = req.body.phone.replace(/\D/g, "");
      req.body.phone = digitsOnly.slice(-10);
    }

    const mentor = new Mentor(req.body);

    mentor.lastActive = new Date(),
    mentor.lastActivityText = "Form Submitted"

    // ✅ 2. Handle monthlyPrice safely (allow empty)
    const monthlyPrice =
      mentor.teachingModes?.homeTuition?.monthlyPrice;

    if (typeof monthlyPrice === "number") {
      mentor.teachingModes.homeTuition.margin =
        monthlyPrice <= 5000 ? 500 : 1000;

      mentor.teachingModes.homeTuition.finalPrice =
        monthlyPrice + mentor.teachingModes.homeTuition.margin;
    } else {
      // If monthlyPrice not provided
      mentor.teachingModes.homeTuition.margin = 0;
      mentor.teachingModes.homeTuition.finalPrice = 0;
    }

    const newMentor = await mentor.save();

    const mentorLead = await MentorLead.findOne({
      phone: req.body.phone
    })
    if (mentorLead) {
      mentorLead.leadFormFilled = true
      mentorLead.status = "first_form"
      mentorLead.mentorId = mentor._id
      await mentorLead.save()
    } else {
      let newMentorLead = new MentorLead(req.body)
      newMentorLead.leadFormFilled = true
      newMentorLead.status = "first_form"
      newMentorLead.mentorId = mentor._id
      await newMentorLead.save()
    }
    res.status(201).json({ data: newMentor });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Server error" });
  }
});

// PUT resolve mentor
const calculateMargin = (price, marginRules) => {
  // Find slab
  const rule = marginRules.find(
    (r) => price >= r.min && price <= r.max
  );

  // If slab found → use it
  if (rule) {
    return rule.margin;
  }

  // If no slab & price > max → default margin
  return 1000;
};
router.put("/:id", async (req, res) => {
  try {
    const { teachingModes } = req.body;
    let updateData = { ...req.body };
    // ✅ Only recalc when monthlyPrice changes
    if (teachingModes?.homeTuition?.monthlyPrice !== undefined) {
      const price = teachingModes.homeTuition.monthlyPrice;

      // 1️⃣ Fetch margin rules
      const marginRules = await MarginRule.find().lean();

      // 2️⃣ Calculate margin
      const margin = calculateMargin(price, marginRules);

      // 3️⃣ Final price
      const finalPrice = +price + +margin;

      // 4️⃣ Force update derived fields
      console.log("check")
      updateData.teachingModes.homeTuition.margin = margin;
      updateData.teachingModes.homeTuition.finalPrice = finalPrice;
    }
    const mentor = await Mentor.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );

    res.status(200).json({ data: mentor });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

function buildRecommendationPipeline({
  parentLat,
  parentLon,
  variant,
}) {
  const bookingBonus = variant === "A" ? 30 : 50;
  const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);

  return [
    // 1️⃣ Basic filtering (cheap operations first)
    {
      $match: {
        "location.city": "Indore",
        showOnWebsite: true,
        runningBookingsCount: { $lt: 3 },
      },
    },

    // 2️⃣ Calculate distance (Haversine formula, in KM)
    {
      $addFields: {
        distanceKm: {
          $multiply: [
            6371, // Earth radius in KM
            {
              $acos: {
                $add: [
                  {
                    $multiply: [
                      {
                        $cos: { $degreesToRadians: parentLat },
                      },
                      {
                        $cos: {
                          $degreesToRadians: "$location.lat",
                        },
                      },
                      {
                        $cos: {
                          $subtract: [
                            { $degreesToRadians: "$location.lon" },
                            { $degreesToRadians: parentLon },
                          ],
                        },
                      },
                    ],
                  },
                  {
                    $multiply: [
                      {
                        $sin: { $degreesToRadians: parentLat },
                      },
                      {
                        $sin: {
                          $degreesToRadians: "$location.lat",
                        },
                      },
                    ],
                  },
                ],
              },
            },
          ],
        },
      },
    },

    // 3️⃣ Teaching-range aware distance score
    {
      $addFields: {
        distanceScore: {
          $switch: {
            branches: [
              {
                // Parent inside mentor range
                case: { $lte: ["$distanceKm", "$teachingRange"] },
                then: 150,
              },
              {
                // Slightly outside range
                case: {
                  $lte: [
                    "$distanceKm",
                    { $add: ["$teachingRange", 3] },
                  ],
                },
                then: 80,
              },
              {
                // Far but acceptable
                case: {
                  $lte: [
                    "$distanceKm",
                    { $add: ["$teachingRange", 7] },
                  ],
                },
                then: 40,
              },
            ],
            default: 0,
          },
        },
      },
    },

    // 4️⃣ Subject + booking + rotation scoring
    {
      $addFields: {
        priorityScore: {
          $add: [
            "$distanceScore",

            // 🔥 class 9–10 Mathematics
            {
              $cond: [
                {
                  $in: [
                    "Mathematics",
                    {
                      $ifNull: [
                        "$teachingPreferences.school.class-9-10",
                        [],
                      ],
                    },
                  ],
                },
                100,
                0,
              ],
            },

            // 🟠 class 6–8 Mathematics
            {
              $cond: [
                {
                  $in: [
                    "Mathematics",
                    {
                      $ifNull: [
                        "$teachingPreferences.school.class-6-8",
                        [],
                      ],
                    },
                  ],
                },
                70,
                0,
              ],
            },

            // 🟡 class 1–5 English
            {
              $cond: [
                {
                  $in: [
                    "English",
                    {
                      $ifNull: [
                        "$teachingPreferences.school.class-1-5",
                        [],
                      ],
                    },
                  ],
                },
                40,
                0,
              ],
            },

            // Booking engagement bonus
            {
              $cond: [
                { $gt: ["$runningBookingsCount", 0] },
                bookingBonus,
                0,
              ],
            },

            // Rotation penalty
            {
              $cond: [
                { $gt: ["$lastShownAt", last24Hours] },
                -20,
                0,
              ],
            },
          ],
        },
      },
    },

    // 5️⃣ Category buckets
    {
      $facet: {
        gold: [
          { $match: { category: "gold" } },
          { $sort: { priorityScore: -1 } },
          { $limit: 2 },
        ],
        silver: [
          { $match: { category: "silver" } },
          { $sort: { priorityScore: -1 } },
          { $limit: 2 },
        ],
        budget: [
          { $match: { category: "budget" } },
          { $sort: { priorityScore: -1 } },
          { $limit: 4 },
        ],
      },
    },

    // 6️⃣ Final merge
    {
      $project: {
        mentors: {
          $concatArrays: ["$gold", "$silver", "$budget"],
        },
      },
    },
  ];
}
router.put("/mark-viewed", async (req, res) => {
  try {
    await Mentor.updateMany(
      { isViewedByAdmin: false },
      { isViewedByAdmin: true }
    );

    res.json({ success: true });
  } catch (err) {
    console.error("Mark viewed error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to mark as viewed",
    });
  }
});




// CHANGE mentor password — uses .save() so the pre-save hash hook runs
const rateLimitPwd = require("../middleware/rateLimit");
router.post("/change-password", rateLimitPwd({ windowMs: 60_000, max: 5 }), async (req, res) => {
  try {
    const { phone, oldPassword, newPassword } = req.body;
    if (!phone || !oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "phone, oldPassword and newPassword are required" });
    }
    const Mentor = require("../models/Mentor");
    const mentor = await Mentor.findOne({ phone: Number(phone) });
    if (!mentor) return res.status(404).json({ success: false, message: "Mentor not found" });
    const ok = await mentor.comparePassword(oldPassword);
    if (!ok) return res.status(400).json({ success: false, message: "Current password is incorrect" });
    mentor.password = newPassword;
    await mentor.save();
    return res.json({ success: true, message: "Password updated" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
