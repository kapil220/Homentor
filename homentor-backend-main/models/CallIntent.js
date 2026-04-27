const mongoose = require("mongoose");

const CallIntentSchema = new mongoose.Schema(
  {
    // 📞 Parent who initiated the call
    parentPhone: {
      type: String,
      required: true,
      index: true, // fast lookup when Exotel hits webhook
    },

    // 👨‍🏫 Mentor to connect
    mentorPhone: {
      type: String,
      required: true,
    },

    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: false,
    },

    mentorName: {
      type: String,
    },

    // 📲 Which calling mode initiated this intent
    mode: {
      type: String,
      enum: ["exotel", "direct"],
      default: "exotel",
      index: true,
    },

    // ⏱ Validity window (important)
    createdAt: {
      type: Date,
      default: Date.now,
      // expires: 300, // ⛔ auto-delete after 5 minutes
    },

    // 📊 Call status tracking (optional but powerful)
    status: {
      type: String,
      enum: ["initiated", "connected", "missed", "failed"],
      default: "initiated",
    }

  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("CallIntent", CallIntentSchema);
