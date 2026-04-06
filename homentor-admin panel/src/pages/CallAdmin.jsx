import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../comp/AdminLayout";

const statusColor = {
  completed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  busy: "bg-yellow-100 text-yellow-700",
  "no-answer": "bg-gray-200 text-gray-700",
};

const AdminCallLogs = () => {
  const [calls, setCalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [fromFilter, setFromFilter] = useState("");
  const [toFilter, setToFilter] = useState("");
  const [connectionFilter, setConnectionFilter] = useState("all");
  // all | connected | not_connected


  useEffect(() => {
    fetchCallLogs();
  }, []);

  // 🔹 Fetch from DB (CallLogs)
  const fetchCallLogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/call-logs`
      );
      setCalls(res.data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Sync Exotel → DB
  const syncCallLogs = async () => {
    try {
      setSyncing(true);

      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/exotel/sync-call-logs`
      );

      // After sync, reload DB data
      await fetchCallLogs();
    } catch (err) {
      console.error("Sync failed", err);
      alert("Sync failed. Check logs.");
    } finally {
      setSyncing(false);
    }
  };
  
 const formatDateTimeExact = (time) => {
  if (!time) return "-";
  const d = new Date(time);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = d.toLocaleString("en-IN", {
    month: "short",
    timeZone: "UTC",
  });
  const year = d.getUTCFullYear();
  let hours = d.getUTCHours();
  const minutes = String(d.getUTCMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
};

  const filteredCalls = calls.filter((call) => {
    // From (Parent)
    if (
      fromFilter &&
      !call.parentPhone?.includes(fromFilter)
    ) {
      return false;
    }

    // To (Mentor)
    if (
      toFilter &&
      !call.mentorPhone?.includes(toFilter)
    ) {
      return false;
    }

    // Connected / Not Connected
    const price = Number(call.price || 0);
    const isConnected = price > 0;

    if (connectionFilter === "connected" && !isConnected) {
      return false;
    }

    if (connectionFilter === "not_connected" && isConnected) {
      return false;
    }

    return true;
  });

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">
            📞 Call Logs
            <span className="text-sm text-gray-500 ml-2">
              ({calls.length})
            </span>
          </h1>

          <button
            onClick={syncCallLogs}
            disabled={syncing}
            className={`px-4 py-2 rounded-lg text-sm font-medium text-white ${syncing
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {syncing ? "Syncing…" : "🔄 Sync Call Logs"}
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

            {/* From (Parent) */}
            <input
              type="text"
              placeholder="From (Parent number)"
              value={fromFilter}
              onChange={(e) => setFromFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />

            {/* To (Mentor) */}
            <input
              type="text"
              placeholder="To (Mentor number)"
              value={toFilter}
              onChange={(e) => setToFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />

            {/* Connected / Not Connected */}
            <select
              value={connectionFilter}
              onChange={(e) => setConnectionFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            >
              <option value="all">All Calls</option>
              <option value="connected">Connected (Money Deducted)</option>
              <option value="not_connected">Not Connected (No Deduction)</option>
            </select>

            {/* Reset */}
            <button
              onClick={() => {
                setFromFilter("");
                setToFilter("");
                setConnectionFilter("all");
              }}
              className="bg-gray-200 hover:bg-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              Reset
            </button>

          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading call logs…
            </div>
          ) : calls.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No call records found
            </div>
          ) : (
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">#</th>
                  <th className="px-4 py-3 text-left">Parent</th>
                  <th className="px-4 py-3 text-left">Mentor</th>
                  <th className="px-4 py-3 text-left">Start</th>
                  <th className="px-4 py-3 text-left">Duration</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Recording</th>
                  <th className="px-4 py-3 text-left">Cost</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredCalls.map((call, idx) => (
                  <tr key={call.callSid} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{idx + 1}</td>

                    <td className="px-4 py-3 font-medium">
                     {call.parentPhone}
                    
                      
                    </td>

                    <td className="px-4 py-3 flex flex-col">
                       <label>{call.mentorPhone}</label>
                       <label className="text-blue-500 text-sm">{call.mentorName}</label>
                    </td>

                    <td className="px-4 py-3">
                      {formatDateTimeExact(call.startTime)} 
                    </td>

                    <td className="px-4 py-3">
                      {call.duration}s
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${call.price>0
                          ? statusColor.completed
                          : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        {call.price > 0
                          ? "connected"
                          : "not connected"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      {call.recordingUrl ? (
                        <a
                          href={call.recordingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          ▶ Play
                        </a>
                      ) : (
                        <span className="text-gray-400">
                          Not available
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      ₹{call.price || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCallLogs;
