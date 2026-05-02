import { useEffect, useMemo, useState } from "react";
import LeadsTab from "@/comp/LeadsTab";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, BookOpen, Wallet, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import StatTile from "@/comp/StatTile";
import ParentDisclaimerModal from "@/comp/ParentDisclaimerModal";
import {
  upcomingThisWeek,
  earnedThisMonth,
  avgRating,
  isActiveBooking,
} from "@/lib/dashboardStats";

const MentorDashboard = () => {
  const navigate = useNavigate();
  const [mentorDetail, setMentorDetail] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  const phone = localStorage.getItem("mentor");

  const load = async () => {
    try {
      const me = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/mentor/login-check`,
        { phone }
      );
      const mentorData = me.data.data;
      setMentorDetail(mentorData);

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/class-bookings/mentor/${mentorData._id}`
      );

      const currentMentorId = mentorData._id.toString();
      const map = new Map<string, any>();
      (res.data.data || []).forEach((b: any) => {
        const bId = b._id;
        const existing = map.get(bId);
        const activeMentorId = b.mentor?._id?.toString() || b.mentor?.toString();
        const isActive = activeMentorId === currentMentorId;
        if (existing?.mentorViewType === "ACTIVE") return;
        const historyEntry = isActive
          ? null
          : b.teacherHistory?.find((h: any) => h.teacherId?.toString() === currentMentorId);
        const mentorViewType = isActive ? "ACTIVE" : historyEntry ? "REPLACED" : "UNKNOWN";
        map.set(bId, { ...b, mentorViewType });
      });
      setBookings(Array.from(map.values()));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const activeStudents = useMemo(
    () =>
      new Set(
        bookings
          .filter((b) => isActiveBooking(b) && b.mentorViewType === "ACTIVE")
          .map((b) => b.parent?._id || b.parent)
      ).size,
    [bookings]
  );
  const upcoming = useMemo(() => upcomingThisWeek(bookings), [bookings]);
  const earnedMonth = useMemo(() => earnedThisMonth(bookings), [bookings]);
  const rating = useMemo(() => avgRating(bookings), [bookings]);

  const todayItems = useMemo(() => {
    const today = new Date();
    return bookings.filter((b) => {
      if (!b.scheduledDate) return false;
      const d = new Date(b.scheduledDate);
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    });
  }, [bookings]);

  return (
    <DashboardLayout
      role="mentor"
      title={mentorDetail?.fullName || "Overview"}
      subtitle={mentorDetail?._id ? `ID: ${mentorDetail._id.slice(0, 10)}` : undefined}
    >
      <div className="space-y-6">
        {/* Profile summary card */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <div className="flex items-center gap-4">
              <img
                src={mentorDetail?.profilePhoto || "/placeholder.svg"}
                alt="mentor"
                className="w-14 h-14 rounded-full border object-cover"
              />
              <div>
                <p className="font-semibold text-gray-900">{mentorDetail?.fullName}</p>
                <p className="text-xs text-gray-500">
                  {mentorDetail?.showOnWebsite ? "Visible on website" : "Hidden from website"}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/dashboard/mentor/profile")}>
                Edit Profile
              </Button>
              <Button onClick={() => navigate("/dashboard/mentor/schedule")}>
                View Schedule
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile
            label="Active Students"
            value={activeStudents}
            icon={<Users className="w-5 h-5" />}
            accent="blue"
          />
          <StatTile
            label="Upcoming (7 days)"
            value={upcoming.length}
            icon={<Calendar className="w-5 h-5" />}
            accent="green"
          />
          <StatTile
            label="Earned this Month"
            value={`₹${earnedMonth.toLocaleString()}`}
            icon={<Wallet className="w-5 h-5" />}
            accent="purple"
          />
          <StatTile
            label="Avg Rating"
            value={rating ? rating.toFixed(1) : "—"}
            icon={<Star className="w-5 h-5" />}
            accent="yellow"
            hint={rating ? "From completed classes" : "No ratings yet"}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          {["Overview", "Leads"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "Leads" && <LeadsTab mentorPhone={phone} />}

        {activeTab === "Overview" && (
        <>
        {/* Today's classes */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Today's Classes</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard/mentor/schedule")}
            >
              View Schedule
            </Button>
          </div>
          {todayItems.length === 0 ? (
            <p className="text-sm text-gray-500">No classes scheduled for today.</p>
          ) : (
            <div className="space-y-2">
              {todayItems.map((c) => (
                <div
                  key={c._id}
                  className="flex items-center justify-between gap-3 border border-gray-100 rounded-lg px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {c.studentName || "Student"} · {c.subject || "—"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(c.scheduledDate).toLocaleString("en-IN", {
                        timeStyle: "short",
                        dateStyle: "medium",
                        timeZone: "Asia/Kolkata",
                      })}
                    </p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">{c.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate("/dashboard/mentor/students")}>
              <Users className="w-4 h-4 mr-2" />
              My Students
            </Button>
            <Button variant="outline" onClick={() => navigate("/mentor/bookings")}>
              <BookOpen className="w-4 h-4 mr-2" />
              All Bookings
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard/mentor/earnings")}>
              <Wallet className="w-4 h-4 mr-2" />
              Earnings
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-center pt-2">
          <button
            onClick={() => setShowDisclaimer(true)}
            className="text-sm text-gray-500 hover:text-blue-600 underline"
          >
            Disclaimer
          </button>
        </div>
        </>
        )}
      </div>

      <ParentDisclaimerModal
        audience={"mentor"}
        open={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        userId={mentorDetail?._id}
        disclaimerAccepted={mentorDetail?.disclaimerAccepted}
      />
    </DashboardLayout>
  );
};

export default MentorDashboard;
