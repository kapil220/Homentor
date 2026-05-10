import axios from "axios";

type Mentor = {
  _id?: string;
  fullName?: string;
};

/**
 * Universal mentor-call entry point for student-facing UI.
 *
 * The student never sees the mentor's phone in browse responses. On click we
 * ask the backend to (a) log a CallIntent and (b) return the correct dial
 * target — the platform Exotel number in exotel mode, or the mentor's phone
 * in direct mode. The phone surfaces only at this moment, not in any list.
 */
export async function callMentor(mentor: Mentor): Promise<void> {
  if (!mentor?._id) {
    alert("Mentor information is unavailable.");
    return;
  }

  const parentPhone = localStorage.getItem("usernumber") || "";
  if (!parentPhone) {
    alert("Please log in to call the mentor.");
    return;
  }

  let dialNumber = "";

  // Race the network with a 1.5s timeout — slow API must not block the dial.
  try {
    const res = await Promise.race([
      axios.post<{ success: boolean; dialNumber: string; callingMode: string }>(
        `${import.meta.env.VITE_API_BASE_URL}/mentor/${mentor._id}/initiate-call`,
        { parentPhone }
      ),
      new Promise<null>((resolve) => setTimeout(() => resolve(null), 1500)),
    ]);
    if (res && "data" in res) {
      dialNumber = res.data?.dialNumber || "";
    }
  } catch (err) {
    console.warn("initiate-call failed", err);
  }

  // Fallback so the user can still dial something even if the server hiccups.
  if (!dialNumber) dialNumber = "07314852387";

  window.location.href = `tel:${dialNumber}`;
}
