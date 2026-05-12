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

module.exports = { maskParentForMentor, REVEALED_STATUSES };
