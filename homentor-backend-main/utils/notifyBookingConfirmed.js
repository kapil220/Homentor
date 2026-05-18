// Fan-out booking confirmation to both parent and mentor via WhatsApp.
// Idempotency: persisted flag `bookingConfirmationSent` on the ClassBooking
// prevents duplicate sends (admin can re-toggle approval; we only notify once).

const { sendEvent } = require("./whatsappService");
const User = require("../models/User");
const Mentor = require("../models/Mentor");

function fmtDate(d) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return String(d);
  return dt.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

async function notifyBookingConfirmed(booking) {
  if (!booking || booking.bookingConfirmationSent) return;

  const [parent, mentor] = await Promise.all([
    booking.parent ? User.findById(booking.parent).lean() : null,
    booking.mentor ? Mentor.findById(booking.mentor).lean() : null,
  ]);

  const studentName = booking.studentName || parent?.parentName || "Student";
  const mentorName = mentor?.fullName || "Your Teacher";
  const date = fmtDate(booking.scheduledDate || booking.bookedDate);
  const time = booking.scheduledTime || "";
  const subject = booking.subject || "";

  const parentPhone = parent?.phone ? `91${String(parent.phone).slice(-10)}` : null;
  const mentorPhone = mentor?.phone ? `91${String(mentor.phone).slice(-10)}` : null;

  await Promise.all([
    parentPhone
      ? sendEvent("booking_parent", { to: parentPhone, studentName, mentorName, date, time }).catch(() => {})
      : Promise.resolve(),
    mentorPhone
      ? sendEvent("booking_teacher", { to: mentorPhone, mentorName, studentName, subject, date, time }).catch(() => {})
      : Promise.resolve(),
  ]);

  booking.bookingConfirmationSent = true;
  await booking.save();
}

module.exports = notifyBookingConfirmed;
