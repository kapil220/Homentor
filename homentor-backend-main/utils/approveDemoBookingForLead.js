const ClassBooking = require("../models/ClassBooking");
const notifyBookingConfirmed = require("./notifyBookingConfirmed");

/**
 * Cascade a TeacherLead's payment approval into its linked demo ClassBooking,
 * so the booking surfaces in the mentor's Bookings section (which filters on
 * adminApproved: true). Mirrors routes/classBooking.js admin-approve logic.
 *
 * No-ops safely when the lead has no linked booking (e.g. call-only leads).
 *
 * @param {object} lead - a TeacherLead document with an optional classBookingId
 * @returns {Promise<boolean>} true if a booking was approved
 */
async function approveDemoBookingForLead(lead) {
  if (!lead || !lead.classBookingId) return false;

  const booking = await ClassBooking.findById(lead.classBookingId);
  if (!booking) return false;

  if (booking.adminApproved) return false; // already approved, nothing to do

  booking.adminApproved = true;
  if (booking.status === "pending_schedule") {
    booking.status = "scheduled";
  }
  await booking.save();

  if (!booking.bookingConfirmationSent) {
    notifyBookingConfirmed(booking).catch((e) =>
      console.warn("booking notify failed:", e?.message)
    );
  }

  return true;
}

module.exports = approveDemoBookingForLead;
