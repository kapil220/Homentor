import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import StatTile from "@/comp/StatTile";
import { Wallet, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import {
  totalEarned,
  earnedThisMonth,
  mentorEarnedForBooking,
  isThisMonth,
} from "@/lib/dashboardStats";

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

const MentorEarnings = () => {
  const phone = localStorage.getItem("mentor");
  const [bookings, setBookings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const me = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/mentor/login-check`,
          { phone }
        );
        const mentorId = me.data.data._id;
        const [bRes, oRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/class-bookings/mentor/${mentorId}`
          ),
          axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/order/by-mentor/${mentorId}`,
            { headers: { "x-user-phone": String(phone || "") } }
          ),
        ]);
        // Inject mentor data into bookings so the earnings formula has monthlyPrice.
        // The /class-bookings/mentor/:id endpoint sometimes returns mentor as a bare
        // ObjectId string instead of a populated object — replace in that case too.
        const meRecord = me.data.data;
        const withMentor = (bRes.data.data || []).map((b: any) => ({
          ...b,
          mentor:
            b.mentor && typeof b.mentor === "object" && b.mentor.teachingModes
              ? b.mentor
              : meRecord,
        }));
        setBookings(withMentor);
        setOrders(oRes.data.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [phone]);

  const earned = useMemo(() => totalEarned(bookings), [bookings]);
  const month = useMemo(() => earnedThisMonth(bookings), [bookings]);
  const completedCount = useMemo(
    () => bookings.filter((b) => b.status === "completed").length,
    [bookings]
  );
  // For running bookings, count only the classes already taken — not the full booking value.
  // mentorEarnedForBooking already prorates by classesTaken, so this is correct.
  const activeBookingValue = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "running")
        .reduce((s, b) => s + mentorEarnedForBooking(b), 0),
    [bookings]
  );

  const rows = useMemo(
    () =>
      bookings
        .map((b) => ({
          id: b._id,
          date: b.bookedDate || b.createdAt,
          student: b.studentName || b.parent?.name || "—",
          subject: b.subject || "—",
          classesDone: Math.floor((b.progress || 0) / 60),
          totalClasses: Number(b.duration) || 22,
          amount: mentorEarnedForBooking(b),
          status: b.status,
          thisMonth: isThisMonth(b.bookedDate || b.createdAt),
        }))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [bookings]
  );

  return (
    <DashboardLayout role="mentor" title="Earnings" subtitle="Per-booking breakdown and totals">
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile
            label="Total Earned"
            value={`₹${earned.toLocaleString()}`}
            icon={<Wallet className="w-5 h-5" />}
            accent="green"
          />
          <StatTile
            label="This Month"
            value={`₹${month.toLocaleString()}`}
            icon={<TrendingUp className="w-5 h-5" />}
            accent="blue"
          />
          <StatTile
            label="In progress"
            value={`₹${activeBookingValue.toLocaleString()}`}
            icon={<Clock className="w-5 h-5" />}
            accent="yellow"
            hint="Earned from running bookings (classes done so far)"
          />
          <StatTile
            label="Completed Bookings"
            value={completedCount}
            icon={<CheckCircle2 className="w-5 h-5" />}
            accent="purple"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Per-Booking Breakdown</h2>
          </div>
          {loading ? (
            <p className="p-6 text-center text-gray-500 text-sm">Loading…</p>
          ) : rows.length === 0 ? (
            <p className="p-6 text-center text-gray-500 text-sm">No bookings yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Booked</th>
                    <th className="px-4 py-3 text-left">Student</th>
                    <th className="px-4 py-3 text-left">Subject</th>
                    <th className="px-4 py-3 text-left">Classes</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">{formatDate(r.date)}</td>
                      <td className="px-4 py-3">{r.student}</td>
                      <td className="px-4 py-3">{r.subject}</td>
                      <td className="px-4 py-3 text-xs">
                        {r.classesDone} / {r.totalClasses}
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        ₹{r.amount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 capitalize text-gray-700">{r.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {orders.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 sm:px-5 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Orders Linked to You</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Parent</th>
                    <th className="px-4 py-3 text-left">Method</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((o) => (
                    <tr key={o._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{formatDate(o.createdAt)}</td>
                      <td className="px-4 py-3">
                        {o.parent?.name || "—"}{" "}
                        <span className="text-xs text-gray-500">{o.parent?.phone}</span>
                      </td>
                      <td className="px-4 py-3 capitalize">{o.paymentMethod}</td>
                      <td className="px-4 py-3 font-semibold">
                        ₹{Number(o.amount || 0).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">{o.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MentorEarnings;
