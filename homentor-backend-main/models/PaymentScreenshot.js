const mongoose = require("mongoose");

const PaymentScreenshotSchema = new mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeacherLead",
      required: true,
      index: true,
    },
    mentorPhone: { type: String, required: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PaymentScreenshot", PaymentScreenshotSchema);
