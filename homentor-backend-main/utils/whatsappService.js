// Unified WhatsApp notification service.
//
// Wraps sendWhatsappTemplate (Exotel) with a template registry so callers
// reference logical events ("booking_parent") instead of raw BSP template
// names. Template names + body parameter order can be tuned via env without
// touching every callsite.
//
// Why: each callsite previously hardcoded a template name and re-ordered
// parameters, which made it impossible to swap BSPs or rename templates
// safely. This indirection survives BSP/template renames.

const sendWhatsappTemplate = require("./sendWhatsapp");

// Map logical event name → { template, build(params) → bodyParams[] }.
// Template name can be overridden via env (WA_TEMPLATE_<EVENT>); body order is
// the contract with the BSP-approved template.
const REGISTRY = {
  otp: {
    template: process.env.WA_TEMPLATE_OTP || "otp_verify",
    build: ({ otp }) => [String(otp)],
  },
  password_share: {
    template: process.env.WA_TEMPLATE_PASSWORD_SHARE || "password_share",
    build: ({ name, password }) => [name || "User", String(password)],
  },
  booking_parent: {
    template: process.env.WA_TEMPLATE_BOOKING_PARENT || "booking",
    build: ({ studentName, mentorName, date, time }) => [
      studentName, mentorName, date, time,
    ],
  },
  booking_teacher: {
    template: process.env.WA_TEMPLATE_BOOKING_TEACHER || "booking_teacher",
    build: ({ mentorName, studentName, subject, date, time }) => [
      mentorName, studentName, subject, date, time,
    ],
  },
  attendance_payment_link: {
    template: process.env.WA_TEMPLATE_ATTENDANCE_PAYMENT || "attendance_payment_link",
    build: ({ studentName, monthName, amount, paymentLink }) => [
      studentName, monthName, String(amount), paymentLink,
    ],
  },
};

async function sendEvent(eventName, { to, ...params }) {
  const entry = REGISTRY[eventName];
  if (!entry) throw new Error(`Unknown WhatsApp event: ${eventName}`);
  if (!to) throw new Error(`Recipient required for event: ${eventName}`);

  try {
    return await sendWhatsappTemplate({
      to,
      templateName: entry.template,
      bodyParams: entry.build(params),
      customData: eventName,
    });
  } catch (err) {
    // Notifications are best-effort. Log and swallow so the parent transaction
    // (signup, booking creation) is never blocked by a BSP outage.
    console.warn(`[whatsapp] event=${eventName} failed:`, err?.response?.data || err?.message);
    return null;
  }
}

module.exports = {
  sendEvent,
  REGISTRY,
};
