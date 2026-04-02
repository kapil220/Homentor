import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../comp/AdminLayout";

// Helper: format date & time
const formatDateTime = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const BookingRecord = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    keyword: "",
    searchType: "parent", // parent | mentor | booking
    status: "",
    fromDate: "",
    toDate: "",
  });

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
 
      const res = await axios.get(
        "https://homentor-backend.onrender.com/api/class-bookings/booking-record",
        {
          params: filters,
        }
      );

      setBookings(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(); // initial load
  }, []);

  return (
    <AdminLayout>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">All Bookings</h2>

        {/* ---------------- FILTER SECTION ---------------- */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
            <input
              className="border px-3 py-2 rounded"
              placeholder="Search..."
              value={filters.keyword}
              onChange={(e) =>
                setFilters({ ...filters, keyword: e.target.value })
              }
            />

            <select
              className="border px-3 py-2 rounded"
              value={filters.searchType}
              onChange={(e) =>
                setFilters({ ...filters, searchType: e.target.value })
              }
            >
              <option value="parent">Parent</option>
              <option value="mentor">Mentor</option>
              <option value="booking">Booking ID</option>
            </select>

            <select
              className="border px-3 py-2 rounded"
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
            >
              <option value="">All Status</option>
              <option value="demo">Demo</option>
              <option value="running">Running</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <input
              type="date"
              className="border px-3 py-2 rounded"
              value={filters.fromDate}
              onChange={(e) =>
                setFilters({ ...filters, fromDate: e.target.value })
              }
            />

            <input
              type="date"
              className="border px-3 py-2 rounded"
              value={filters.toDate}
              onChange={(e) =>
                setFilters({ ...filters, toDate: e.target.value })
              }
            />

            <button
              onClick={fetchBookings}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2"
            >
              Search
            </button>
          </div>
        </div>

        {/* ---------------- TABLE ---------------- */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full border">
            <thead className="bg-gray-100 text-sm">
              <tr>
                <th className="px-4 py-3 border">Date</th>
                <th className="px-4 py-3 border">Parent</th>
                <th className="px-4 py-3 border">Mentor</th>
                <th className="px-4 py-3 border">Class</th>
                <th className="px-4 py-3 border">Status</th>
                <th className="px-4 py-3 border">Amount</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    Loading...
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-6">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b._id} className="hover:bg-gray-50 text-sm">
                    <td className="px-4 py-3 border">
                      {b.isDemo ?
                      <div className="font-medium text-orange-700">Demo</div> :
                      <div className="font-medium text-green-700">Session: {b.session}</div>}
                      <div className="text-xs text-gray-500">
                        {formatDateTime(b.createdAt)}
                      </div>
                    </td>

                    <td className="px-4 py-3 border">
                      <div className="font-medium">{b.parent?.name}</div>
                      <div className="text-xs text-gray-500">
                        {b.parent?.phone}
                      </div>
                    </td>

                    <td className="px-4 py-3 border">
                      <div className="font-medium">{b.mentor?.fullName}</div>
                      <div className="text-xs text-gray-500">
                        {b.mentor?.phone}
                      </div>
                    </td>

                    <td className="px-4 py-3 border">
                      {b.class || "-"}
                    </td>

                    <td className="px-4 py-3 border">
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          b.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : b.status === "running"
                            ? "bg-blue-100 text-blue-700"
                            : b.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 border font-semibold">
                      ₹{b.price}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default BookingRecord;
