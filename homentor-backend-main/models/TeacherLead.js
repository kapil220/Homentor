// homentor-backend-main/models/TeacherLead.js
const mongoose = require("mongoose");

const teacherLeadSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    parentPhone: {
      type: String,
      required: true,
    },
    parentName: { type: String, default: "" },
    parentClass: { type: String, default: "" },
    parentSubjects: { type: String, default: "" },
    parentLocation: {
      city: { type: String, default: "" },
      area: { type: String, default: "" },
    },
    callCount: { type: Number, default: 1 },
    lastCalledAt: { type: Date, default: Date.now },
    commissionPaid: { type: Boolean, default: false },
    commissionAmount: { type: Number, default: 0 },
    paymentRef: { type: String, default: "" },
    paymentStatus: {
      type: String,
      enum: ["pending", "submitted", "approved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

// One lead per parent-teacher pair
teacherLeadSchema.index({ mentorId: 1, parentPhone: 1 }, { unique: true });

module.exports = mongoose.model("TeacherLead", teacherLeadSchema);
