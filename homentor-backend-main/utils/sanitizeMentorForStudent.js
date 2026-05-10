// Strips mentor PII before returning to student-facing endpoints.
// Keep coarse location (area/city/state) for distance/area display;
// drop street-level address, phone, email, password, lat/lon.
function sanitizeMentorForStudent(mentor) {
  if (!mentor) return mentor;
  const src = mentor._doc ? mentor._doc : mentor;
  const m = { ...src };
  delete m.phone;
  delete m.email;
  delete m.address;
  delete m.password;
  if (m.location && typeof m.location === "object") {
    const { area, city, state } = m.location;
    m.location = { area, city, state };
  }
  return m;
}

module.exports = sanitizeMentorForStudent;
