// homentor-backend-main/utils/resolveCommission.js
const Admin = require("../models/Admin");

/**
 * Resolves the commission amount for a mentor.
 * Priority: mentor.commissionOverride → admin.commissionByCategory[mentor.category] → 0
 */
async function resolveCommission(mentor) {
  if (mentor.commissionOverride != null && mentor.commissionOverride > 0) {
    return mentor.commissionOverride;
  }
  const admin = await Admin.findOne().select("commissionByCategory");
  if (!admin) return 0;
  const category = mentor.category || "Regular";
  return admin.commissionByCategory?.[category] || 0;
}

module.exports = resolveCommission;
