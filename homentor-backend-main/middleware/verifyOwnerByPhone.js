/**
 * Minimal phone-based ownership middleware.
 *
 * The frontend dashboards put the logged-in phone in localStorage and
 * derive a Mongo _id from `users/login-check` / `mentor/login-check`.
 * Sensitive list endpoints keyed by that _id (`/order/by-parent/:id`,
 * `/order/by-mentor/:id`) need at least a soft check that the requester's
 * phone resolves to the same _id — otherwise anyone can enumerate.
 *
 * Usage:
 *   router.get(
 *     "/by-parent/:parentId",
 *     verifyOwnerByPhone({ model: "User", phoneHeader: "x-user-phone", paramKey: "parentId" }),
 *     handler
 *   );
 *
 * Request must include `x-user-phone` header. The middleware:
 *   - Looks up the matching record by phone.
 *   - 403s if the record doesn't exist or its _id doesn't match `:paramKey`.
 *   - Attaches `req.actor = { _id, phone }` for downstream handlers.
 *
 * This is intentionally a soft check (no signed token), matching the
 * pre-existing localStorage-based posture. It closes the trivial
 * enumeration hole — not a substitute for real auth.
 */

const User = require("../models/User");
const Mentor = require("../models/Mentor");

const MODELS = { User, Mentor };

function verifyOwnerByPhone({ model = "User", paramKey = "id", phoneHeader = "x-user-phone" } = {}) {
  const Model = MODELS[model];
  if (!Model) throw new Error(`verifyOwnerByPhone: unknown model "${model}"`);

  return async (req, res, next) => {
    try {
      const rawPhone = req.headers[phoneHeader];
      if (!rawPhone) {
        return res.status(401).json({ success: false, message: "Missing identification header" });
      }
      const phone = String(rawPhone).replace(/\D/g, "");
      if (phone.length < 10) {
        return res.status(401).json({ success: false, message: "Invalid identification" });
      }

      // Both User and Mentor schemas store phone as Number — query both forms.
      const owner = await Model.findOne({ $or: [{ phone: Number(phone) }, { phone }] }).select("_id phone");
      if (!owner) {
        return res.status(403).json({ success: false, message: "Not authorized" });
      }

      const requestedId = req.params[paramKey];
      if (String(owner._id) !== String(requestedId)) {
        return res.status(403).json({ success: false, message: "Not authorized for this resource" });
      }

      req.actor = { _id: owner._id, phone: owner.phone };
      next();
    } catch (err) {
      console.error("verifyOwnerByPhone error", err);
      return res.status(500).json({ success: false, message: "Auth check failed" });
    }
  };
}

module.exports = verifyOwnerByPhone;
