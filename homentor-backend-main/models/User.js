const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  phone: Number,
  password: { type: String },
  address: {
    type: Object
  },
  parentName: String,
  children: Array,
  disclaimerAccepted: {
    type: Boolean,
    default: false,
  },
  disclaimers: {
    type : Array
  }

}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model("User", userSchema);
