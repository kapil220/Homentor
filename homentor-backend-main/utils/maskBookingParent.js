const REVEALED_STATUSES = new Set(["scheduled", "running", "completed"]);

function maskParentForMentor(booking) {
  if (!booking) return booking;
  const obj = typeof booking.toObject === "function" ? booking.toObject() : { ...booking };
  if (!REVEALED_STATUSES.has(obj.status) && obj.parent && typeof obj.parent === "object") {
    obj.parent = {
      ...obj.parent,
      phone: null,
      address: null,
    };
  }
  return obj;
}

// Bookings created from a fresh order often leave studentName/subject/class/
// school empty (they're only copied when continuing a previous booking). The
// data lives on the parent's saved child profile, so backfill any empty field
// from parent.children[0] before sending to the mentor. Drops the raw children
// array from the response afterward so we don't leak the full profile.
function fillStudentInfoFromParent(booking) {
  if (!booking) return booking;
  const obj = typeof booking.toObject === "function" ? booking.toObject() : { ...booking };
  const parent = obj.parent;

  if (parent && typeof parent === "object" && Array.isArray(parent.children)) {
    const child = parent.children[0];
    if (child) {
      if (!obj.studentName) obj.studentName = child.name || "";
      if (!obj.class) obj.class = child.class || child.grade || child.className || "";
      if (!obj.school) obj.school = child.school || "";
      if (!obj.subject) {
        obj.subject = Array.isArray(child.subjects)
          ? child.subjects.join(", ")
          : child.subjects || "";
      }
    }
    // strip the raw children array — it was only needed for the backfill
    obj.parent = { ...parent };
    delete obj.parent.children;
  }

  return obj;
}

module.exports = { maskParentForMentor, fillStudentInfoFromParent, REVEALED_STATUSES };
