// Helpers for computing dashboard stats from ClassBooking arrays.
// Centralizes the math so Student/Mentor overviews stay consistent.

type AnyBooking = any;

export const isActiveBooking = (b: AnyBooking) =>
  b?.status === "scheduled" || b?.status === "running";

export const isPendingBooking = (b: AnyBooking) =>
  b?.status === "pending_schedule";

export const completedHours = (b: AnyBooking) =>
  Math.round(((b?.progress || 0) / 60) * 10) / 10;

export const totalHoursDone = (bookings: AnyBooking[]) =>
  bookings.reduce((sum, b) => sum + completedHours(b), 0);

export const moneySpent = (bookings: AnyBooking[]) =>
  bookings
    .filter((b) => b?.adminApproved)
    .reduce((sum, b) => sum + (Number(b?.price) || 0), 0);

export const isThisMonth = (iso?: string) => {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return (
    d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  );
};

export const upcomingThisWeek = (bookings: AnyBooking[]) => {
  const now = new Date();
  const weekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return bookings.filter((b) => {
    if (!b?.scheduledDate) return false;
    const t = new Date(b.scheduledDate).getTime();
    return t >= now.getTime() && t <= weekAhead.getTime();
  });
};

export const mentorEarnedForBooking = (b: AnyBooking) => {
  // Same formula as MentorDashboard payment summary:
  // (monthlyPrice / duration) * classesTaken
  const monthly = b?.mentor?.teachingModes?.homeTuition?.monthlyPrice || 0;
  const duration = Number(b?.duration) || 22;
  const classesTaken = Math.floor(((b?.progress || 0) / 60));
  if (!monthly) return 0;
  return Math.round((monthly / duration) * classesTaken);
};

export const totalEarned = (bookings: AnyBooking[]) =>
  bookings.reduce((sum, b) => sum + mentorEarnedForBooking(b), 0);

export const earnedThisMonth = (bookings: AnyBooking[]) =>
  bookings
    .filter((b) => isThisMonth(b?.bookedDate || b?.createdAt))
    .reduce((sum, b) => sum + mentorEarnedForBooking(b), 0);

export const avgRating = (bookings: AnyBooking[]) => {
  const rated = bookings.filter((b) => Number(b?.rating) > 0);
  if (rated.length === 0) return 0;
  const sum = rated.reduce((s, b) => s + Number(b.rating || 0), 0);
  return Math.round((sum / rated.length) * 10) / 10;
};
