import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "../comp/AdminLayout";
import StatTile from "../comp/StatTile";
import {
  UserPlus,
  CalendarCheck,
  Phone,
  ClipboardList,
  IndianRupee,
  Receipt,
  AlertTriangle,
  Users,
  ArrowRight,
} from "lucide-react";

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;
const formatDate = (iso) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [pendingBookings, setPendingBookings] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [adminRes, bookingsRes, ordersRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/class-bookings/booking-record`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/order/`),
        ]);
        setStats(adminRes.data || {});
        const allB = bookingsRes.data?.data || [];
        setPendingBookings(
          allB
            .filter((b) => !b.adminApproved && b.status === "pending_schedule")
            .slice(0, 5)
        );
        const allO = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data?.data || [];
        setPendingOrders(
          allO
            .filter((o) => o.status === "PENDING")
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
            .slice(0, 5)
        );
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openLeads = (stats.mentorLeadsOpen || 0) + (stats.parentLeadsOpen || 0);

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-8 px-4 py-4">
        {/* Activity row */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Activity
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatTile
              label="Mentor Requests"
              value={stats.mentorRequests || 0}
              icon={<UserPlus className="w-5 h-5" />}
              accent="blue"
              hint="Awaiting your review"
              onClick={() => navigate("/mentor-request")}
            />
            <StatTile
              label="Pending Approvals"
              value={stats.pendingApprovals || stats.bookings || 0}
              icon={<CalendarCheck className="w-5 h-5" />}
              accent="yellow"
              hint="Cash / manual bookings"
              onClick={() => navigate("/class-booking")}
            />
            <StatTile
              label="Today's Calls"
              value={stats.todayCalls || 0}
              icon={<Phone className="w-5 h-5" />}
              accent="purple"
              onClick={() => navigate("/calling-sheet")}
            />
            <StatTile
              label="Open Leads"
              value={openLeads}
              icon={<ClipboardList className="w-5 h-5" />}
              accent="green"
              hint={`${stats.mentorLeadsOpen || 0} mentor / ${stats.parentLeadsOpen || 0} parent`}
              onClick={() => navigate("/mentor-leads")}
            />
          </div>
        </div>

        {/* Finance row */}
        <div>
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Finance
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatTile
              label="Today's Revenue"
              value={formatINR(stats.todayRevenue)}
              icon={<IndianRupee className="w-5 h-5" />}
              accent="green"
              hint="From PAID orders"
            />
            <StatTile
              label="Today's Orders"
              value={stats.todayOrders || 0}
              icon={<Receipt className="w-5 h-5" />}
              accent="blue"
              onClick={() => navigate("/all-orders")}
            />
            <StatTile
              label="Pending Verification"
              value={formatINR(stats.pendingPaymentAmount)}
              icon={<AlertTriangle className="w-5 h-5" />}
              accent="yellow"
              hint="Manual UPI awaiting approval"
              onClick={() => navigate("/all-orders")}
            />
            <StatTile
              label="Active Mentors"
              value={`${stats.activeMentors || 0} / ${stats.totalMentors || 0}`}
              icon={<Users className="w-5 h-5" />}
              accent="purple"
              hint="Visible on website"
              onClick={() => navigate("/all-mentor")}
            />
          </div>
        </div>

        {/* Needs your attention */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending bookings */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Pending Booking Approvals</h3>
              <button
                onClick={() => navigate("/class-booking")}
                className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            {loading ? (
              <p className="p-5 text-sm text-gray-500">Loading…</p>
            ) : pendingBookings.length === 0 ? (
              <p className="p-5 text-sm text-gray-500">All caught up.</p>
            ) : (
              <div className="divide-y">
                {pendingBookings.map((b) => (
                  <div
                    key={b._id}
                    className="px-4 py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {b.studentName || b.parent?.name || "—"} · {b.mentor?.fullName || "—"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {b.paymentMethod || "online"} · {formatINR(b.price)} ·{" "}
                        {formatDate(b.bookedDate || b.createdAt)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        b.paymentMethod === "manual"
                          ? "bg-yellow-100 text-yellow-800"
                          : b.paymentMethod === "cash"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {b.paymentMethod || "online"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending orders */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Pending Order Verification</h3>
              <button
                onClick={() => navigate("/all-orders")}
                className="text-xs text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            {loading ? (
              <p className="p-5 text-sm text-gray-500">Loading…</p>
            ) : pendingOrders.length === 0 ? (
              <p className="p-5 text-sm text-gray-500">No pending orders.</p>
            ) : (
              <div className="divide-y">
                {pendingOrders.map((o) => (
                  <div
                    key={o._id}
                    className="px-4 py-3 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {o.parent?.name || "—"} → {o.mentor?.fullName || "—"}
                      </p>
                      <p className="text-xs text-gray-500 break-all">
                        {o.paymentMethod || "online"} · {formatINR(o.amount)} · Ref:{" "}
                        {o.paymentReference || o.orderId}
                      </p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full font-medium bg-yellow-100 text-yellow-800">
                      PENDING
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
