import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminLayout from "../comp/AdminLayout";
import StatTile from "../comp/StatTile";
import { IndianRupee, AlertTriangle, Receipt, Calendar } from "lucide-react";

const formatINR = (n) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

const formatDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const methodPillClass = (m) => {
  const map = {
    online: "bg-blue-100 text-blue-700",
    cash: "bg-green-100 text-green-700",
    manual: "bg-yellow-100 text-yellow-700",
  };
  return map[m] || "bg-gray-100 text-gray-700";
};

const statusPillClass = (s) => {
  const map = {
    PAID: "bg-green-100 text-green-700",
    PENDING: "bg-yellow-100 text-yellow-700",
    FAILED: "bg-red-100 text-red-700",
  };
  return map[s] || "bg-gray-100 text-gray-700";
};

export default function AllOrders() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [ordersRes, statsRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/order/`),
          axios.get(`${import.meta.env.VITE_API_BASE_URL}/order/stats`),
        ]);
        const list = Array.isArray(ordersRes.data) ? ordersRes.data : ordersRes.data?.data || [];
        list.sort(
          (a, b) =>
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        );
        setOrders(list);
        setStats(statsRes.data || {});
      } catch (err) {
        console.error("Orders load failed", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      if (statusFilter !== "all" && o.status !== statusFilter) return false;
      // Legacy orders predate the paymentMethod field — treat them as a separate "unknown" bucket
      // so picking "Online" doesn't silently include them.
      const method = o.paymentMethod || "unknown";
      if (methodFilter !== "all" && method !== methodFilter) return false;
      if (fromDate) {
        const t = new Date(o.createdAt || 0).getTime();
        if (t < new Date(fromDate).getTime()) return false;
      }
      if (toDate) {
        const t = new Date(o.createdAt || 0).getTime();
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        if (t > end.getTime()) return false;
      }
      if (q) {
        const hay =
          `${o.orderId || ""} ${o.parent?.phone || ""} ${o.parent?.name || ""} ${
            o.mentor?.fullName || ""
          } ${o.mentor?.phone || ""} ${o.paymentReference || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [orders, search, statusFilter, methodFilter, fromDate, toDate]);

  const reset = () => {
    setSearch("");
    setStatusFilter("all");
    setMethodFilter("all");
    setFromDate("");
    setToDate("");
  };

  return (
    <AdminLayout title="Orders">
      <div className="space-y-6 px-4 py-4">
        {/* Stat tiles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile
            label="Total Revenue"
            value={formatINR(stats.totalRevenue)}
            icon={<IndianRupee className="w-5 h-5" />}
            accent="green"
            hint="All PAID orders"
          />
          <StatTile
            label="Pending Verification"
            value={formatINR(stats.pendingAmount)}
            icon={<AlertTriangle className="w-5 h-5" />}
            accent="yellow"
            hint="Awaiting admin approval"
          />
          <StatTile
            label="Today's Orders"
            value={stats.todayOrders || 0}
            icon={<Calendar className="w-5 h-5" />}
            accent="blue"
            hint={`${formatINR(stats.todayRevenue)} earned`}
          />
          <StatTile
            label="Total Orders"
            value={stats.totalOrders || orders.length}
            icon={<Receipt className="w-5 h-5" />}
            accent="purple"
          />
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
            <input
              type="text"
              placeholder="Search order ID / phone / mentor / reference"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm lg:col-span-2"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="PAID">PAID</option>
              <option value="PENDING">PENDING</option>
              <option value="FAILED">FAILED</option>
            </select>
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Methods</option>
              <option value="online">Online (Gateway)</option>
              <option value="cash">Cash</option>
              <option value="manual">Manual UPI</option>
              <option value="unknown">Unknown (legacy)</option>
            </select>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Showing {filtered.length} of {orders.length} orders
            </p>
            <button
              onClick={reset}
              className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
            >
              Reset filters
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {loading ? (
            <p className="p-8 text-center text-gray-500">Loading orders…</p>
          ) : filtered.length === 0 ? (
            <p className="p-8 text-center text-gray-500">No orders match the filters.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 text-gray-700">
                  <tr>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Order ID</th>
                    <th className="px-4 py-3 text-left">Parent</th>
                    <th className="px-4 py-3 text-left">Mentor</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Method</th>
                    <th className="px-4 py-3 text-left">Reference</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filtered.map((o) => (
                    <tr key={o._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-xs">
                        {formatDate(o.createdAt)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs break-all">{o.orderId}</td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{o.parent?.name || "—"}</div>
                        <div className="text-xs text-gray-500">
                          {o.parent?.phone || o.userPhone}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium">{o.mentor?.fullName || "—"}</div>
                        <div className="text-xs text-gray-500">{o.mentor?.phone}</div>
                      </td>
                      <td className="px-4 py-3 font-semibold">{formatINR(o.amount)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${methodPillClass(
                            o.paymentMethod
                          )}`}
                        >
                          {o.paymentMethod || "online"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700 break-all max-w-[180px]">
                        {o.paymentReference || <span className="text-gray-400">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusPillClass(
                            o.status
                          )}`}
                        >
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
