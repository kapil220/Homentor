const mongoose = require('mongoose');

const AdminCreationSchema = new mongoose.Schema({
  callingNo : Number,
  callingMode: { type: String, enum: ["exotel", "direct"], default: "direct" },

  // Online payment routing: "gateway" = use PayU, "manual" = show UPI/bank details to user
  onlinePaymentMode: { type: String, enum: ["gateway", "manual"], default: "gateway" },
  upiId: { type: String, default: "" },
  bankAccountName: { type: String, default: "" },
  bankAccountNumber: { type: String, default: "" },
  bankIfsc: { type: String, default: "" },
  bankName: { type: String, default: "" },
  paymentInstructions: { type: String, default: "" }
});

module.exports = mongoose.model('AdminCreation', AdminCreationSchema);
