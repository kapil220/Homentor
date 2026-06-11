// homentor-backend-main/models/TeacherLead.js
const mongoose = require("mongoose");

const teacherLeadSchema = new mongoose.Schema(
  {
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    // Set when this lead originated from (or was matched to) a demo booking.
    // Used to cascade admin payment approval into the linked ClassBooking so it
    // surfaces in the mentor's Bookings section. Absent for call-only leads.
    classBookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ClassBooking",
      default: null,
    },
    parentPhone: {
      type: String,
      required: true,
      trim: true,
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
    seenByMentor: { type: Boolean, default: false },
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
