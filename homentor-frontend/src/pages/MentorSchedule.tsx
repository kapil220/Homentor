import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import ScheduleModal from "@/comp/SetScheduleForm";
import AttendanceModal from "@/comp/AttendanceModal";

const formatTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Kolkata",
      })
    : "—";

const MentorSchedule = () => {
  const phone = localStorage.getItem("mentor");
  const [bookings, setBookings] = useState<any[]>([]);

  const load = async () => {
    try {
      const me = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/mentor/login-check`,
        { phone }
      );
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/class-bookings/mentor/${me.data.data._id}`
      );
      setBookings(res.data.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const now = Date.now();
  const upcoming = useMemo(
    () =>
      bookings
        .filter((b) => b.scheduledDate && new Date(b.scheduledDate).getTime() >= now)
        .sort(
          (a, b) =>
            new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime()
        ),
    [bookings, now]
  );
  const past = useMemo(
    () =>
      bookings
        .filter((b) => b.scheduledDate && new Date(b.scheduledDate).getTime() < now)
        .sort(
          (a, b) =>
            new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
        )
        .slice(0, 20),
    [bookings, now]
  );
  const pendingSchedule = useMemo(
    () => bookings.filter((b) => b.status === "pending_schedule"),
    [bookings]
  );

  const Section = ({
    title,
    items,
    empty,
  }: {
    title: string;
    items: any[];
    empty: string;
  }) => (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-4 sm:px-5 py-3 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900">
          {title} <span className="text-sm text-gray-500 font-normal">({items.length})</span>
        </h2>
      </div>
      {items.length === 0 ? (
        <p className="p-5 text-sm text-gray-500">{empty}</p>
      ) : (
        <div className="divide-y">
          {items.map((b) => (
            <div
              key={b._id}
              className="px-4 sm:px-5 py-3 flex flex-wrap items-center gap-3 justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium text-sm">
                  {b.studentName || "Student"} · {b.subject || "—"}
                </p>
                <p className="text-xs text-gray-500">{formatTime(b.scheduledDate)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-700">{b.status}</Badge>
                {b.status === "pending_schedule" && (
                  <ScheduleModal classBooking={b} getBookings={load} />
                )}
                {(b.status === "scheduled" || b.status === "running") && (
                  <AttendanceModal classBooking={b} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout role="mentor" title="Schedule" subtitle="Upcoming and past classes">
      <div className="space-y-6">
        <Section
          title="Awaiting Schedule"
          items={pendingSchedule}
          empty="No bookings waiting to be scheduled."
        />
        <Section title="Upcoming" items={upcoming} empty="Nothing on the calendar." />
        <Section title="Recent (last 20)" items={past} empty="No past classes yet." />
      </div>
    </DashboardLayout>
  );
};

export default MentorSchedule;
