import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import ClassCard from "@/comp/ClassCard";
import NoBookingCard from "@/comp/NoBookingCard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { isActiveBooking, isPendingBooking } from "@/lib/dashboardStats";

type Tab = "running" | "scheduled" | "pending";

const StudentClasses = () => {
  const studentNumber = localStorage.getItem("usernumber");
  const [bookings, setBookings] = useState<any[]>([]);
  const [tab, setTab] = useState<Tab>("running");
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const me = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/users/login-check`,
          { phone: studentNumber }
        );
        if (!me.data?.data?._id) return;
        try {
          const res = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/class-bookings/student/${me.data.data._id}`
          );
          setBookings(res.data.data || []);
        } catch (innerErr: any) {
          // Backend returns 404 with success:false when there are no bookings — treat as empty.
          if (innerErr?.response?.status === 404) {
            setBookings([]);
          } else {
            console.error(innerErr);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [studentNumber]);

  const filtered = bookings.filter((b) => {
    if (tab === "running") return b.status === "running";
    if (tab === "scheduled") return b.status === "scheduled";
    if (tab === "pending") return isPendingBooking(b);
    return true;
  });

  const tabs: { key: Tab; label: string; count: number }[] = [
    {
      key: "running",
      label: "Running",
      count: bookings.filter((b) => b.status === "running").length,
    },
    {
      key: "scheduled",
      label: "Scheduled",
      count: bookings.filter((b) => b.status === "scheduled").length,
    },
    {
      key: "pending",
      label: "Pending Approval",
      count: bookings.filter(isPendingBooking).length,
    },
  ];

  return (
    <DashboardLayout role="student" title="My Classes" subtitle="Active and upcoming sessions">
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t.key
                  ? "border-homentor-blue text-homentor-blue"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              {t.label}
              <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <NoBookingCard />
        ) : (
          <div className="space-y-4">
            {filtered.map((c) => (
              <ClassCard classItem={c} userType="parent" key={c._id} />
            ))}
          </div>
        )}

        <div className="pt-2">
          <Button variant="outline" onClick={() => navigate("/parent/bookings")}>
            View Full Booking History
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentClasses;
