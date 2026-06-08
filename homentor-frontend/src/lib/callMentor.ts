import axios from "axios";

type Mentor = {
  _id?: string;
  fullName?: string;
};

type CallConfig = {
  callingNo?: string | number;
  callingMode?: string;
};

/**
 * Universal mentor-call entry point for student-facing UI.
 *
 * In Exotel mode: navigates synchronously (preserves the user gesture so the
 * browser won't block the tel: link) and fires the intent log in the background.
 * The Exotel webhook won't fire until the user manually confirms the call in
 * their phone app, so the intent will always be recorded in time.
 *
 * In direct mode: still uses an async API call to fetch the mentor's phone
 * server-side (never exposed in browse responses).
 */
export function callMentor(mentor: Mentor, config?: CallConfig): void {
  if (!mentor?._id) {
    alert("Mentor information is unavailable.");
    return;
  }

  const parentPhone = localStorage.getItem("usernumber") || "";
  if (!parentPhone) {
    alert("Please log in to call the mentor.");
    return;
  }

  const exotelNo = config?.callingNo ? String(config.callingNo) : "";

  if (config?.callingMode === "exotel" && exotelNo) {
    // Fire intent log in background — no await, so the user gesture is preserved.
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/mentor/${mentor._id}/initiate-call`, {
        parentPhone,
      })
      .catch((err) => console.warn("initiate-call background failed", err));

    // Synchronous navigation — browser allows tel: because we're still in the
    // original click handler with no await before this line.
    window.location.href = `tel:${exotelNo}`;
    return;
  }

  // Direct mode or config not yet loaded: fetch dial target from server.
  axios
    .post<{ success: boolean; dialNumber: string; callingMode: string }>(
      `${import.meta.env.VITE_API_BASE_URL}/mentor/${mentor._id}/initiate-call`,
      { parentPhone }
    )
    .then((res) => {
      const dialNumber = res.data?.dialNumber || "07314626521";
      window.location.href = `tel:${dialNumber}`;
    })
    .catch((err) => {
      console.warn("initiate-call failed", err);
      window.location.href = `tel:07314626521`;
    });
}
