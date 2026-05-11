// homentor-backend-main/utils/resolveCommission.js
const Admin = require("../models/Admin");

/**
 * Resolves the commission amount (in ₹) for a mentor.
 * Priority:
 *   1. mentor.commissionOverride (flat ₹, or % of teachingModes.homeTuition.monthlyPrice)
 *   2. admin.commissionByCategory[mentor.category] (flat ₹)
 *   3. 0
 */
async function resolveCommission(mentor) {
  if (mentor.commissionOverride != null && mentor.commissionOverride > 0) {
    if (mentor.commissionType === "percent") {
      const monthlyPrice = Number(
        mentor?.teachingModes?.homeTuition?.monthlyPrice || 0
      );
      if (!monthlyPrice) return 0;
      return Math.round((monthlyPrice * mentor.commissionOverride) / 100);
    }
    return mentor.commissionOverride;
  }
  const admin = await Admin.findOne().select("commissionByCategory");
  if (!admin) return 0;
  const category = mentor.category || "silver";
  return admin.commissionByCategory?.[category] || 0;
}

module.exports = resolveCommission;
