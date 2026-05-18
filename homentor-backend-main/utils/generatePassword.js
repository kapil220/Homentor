// Generates a short, human-friendly password for auto-created accounts.
// Format: lowercase letter + 5 alphanumerics → 6 chars, easy to share over WhatsApp/SMS.
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"; // no l, i, o, 0, 1

function generatePassword(length = 6) {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

module.exports = generatePassword;
