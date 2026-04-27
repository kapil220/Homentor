const express = require("express");
const ParentLead = require("../models/ParentLead.js");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const lead = await ParentLead.create(req.body);
    res.status(201).json(lead);
  } catch (err) {
    // Friendly handling for repeat submissions: phone is unique on the model
    if (err && err.code === 11000) {
      return res.status(200).json({ duplicate: true, message: "We already have your details — our team will reach out shortly." });
    }
    res.status(400).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  const leads = await ParentLead.find().sort({ createdAt: -1 });
  res.json(leads);
});

router.put("/:id", async (req, res) => {
  const lead = await ParentLead.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(lead);
});


module.exports = router;
