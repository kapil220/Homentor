import axios from "axios";

type AdminCallConfig = {
  callingMode: "direct" | "exotel";
  callingNo: string | number | null;
};

let cached: { value: AdminCallConfig; at: number } | null = null;
const TTL_MS = 60 * 1000; // 1 min — short so admin toggles take effect quickly

const fetchAdminCallConfig = async (): Promise<AdminCallConfig> => {
  if (cached && Date.now() - cached.at < TTL_MS) return cached.value;
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin`);
    const cfg = res.data?.data?.[0] || {};
    const value: AdminCallConfig = {
      callingMode: cfg.callingMode === "exotel" ? "exotel" : "direct",
      callingNo: cfg.callingNo ?? null,
    };
    cached = { value, at: Date.now() };
    return value;
  } catch {
    // Default to direct so the user can still call.
    return { callingMode: "direct", callingNo: null };
  }
};

type Mentor = {
  _id?: string;
  fullName?: string;
  phone?: string | number;
};

/**
 * Universal mentor-call entry point.
 *  - Reads admin's callingMode (exotel vs direct) — cached for 60s.
 *  - Logs a CallIntent on the backend so admin sees every call attempt.
 *  - Redirects the user to a tel: link (mentor's phone for direct, the platform
 *    Exotel number for exotel mode).
 *
 * Use everywhere a "Call mentor" button exists.
 */
export async function callMentor(mentor: Mentor): Promise<void> {
  if (!mentor?.phone) {
    alert("Mentor phone number is unavailable.");
    return;
  }

  const parentPhone = localStorage.getItem("usernumber") || "";
  const cfg = await fetchAdminCallConfig();

  // Always log the intent. Wait briefly so it makes it to the server before
  // the browser navigates away to the dialer (which can cancel in-flight
  // requests on some mobile browsers). Capped at 1.5s so a slow API doesn't
  // block the user from calling.
  try {
    await Promise.race([
      axios.post(`${import.meta.env.VITE_API_BASE_URL}/exotel/call/initiate`, {
        parentPhone:
          cfg.callingMode === "exotel" && parentPhone ? `0${parentPhone}` : parentPhone,
        mentorId: mentor._id,
        mentorPhone: mentor.phone,
        mentorName: mentor.fullName,
        mode: cfg.callingMode,
      }),
      new Promise((resolve) => setTimeout(resolve, 1500)),
    ]);
  } catch (err) {
    console.warn("call intent log failed", err);
  }

  if (cfg.callingMode === "exotel") {
    // Route through the platform Exotel number so the call is mediated/recorded.
    const platformNumber = cfg.callingNo ? String(cfg.callingNo) : "07314852387";
    window.location.href = `tel:${platformNumber}`;
    return;
  }

  // Direct: connect the parent straight to the mentor.
  window.location.href = `tel:${mentor.phone}`;
}
