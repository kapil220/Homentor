import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../comp/AdminLayout";
import DirectBookingForm from "../comp/DirectBookingForm";
import DemoControlPanel from "../comp/DemoControlPanel";
import ClassRecordView from "../comp/ClassRecordView";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
  const markViewed = async () => {
    await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/class-bookings/mark-viewed`,
      { method: "PUT" }
    );
  };

  markViewed();
}, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/class-bookings/booking-record`
      );
      setBookings(response.data.data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/class-bookings/${id}`
      );
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking");
    }
  };

  // ------------ ADMIN APPROVE TOGGLE --------------
  const handleAdminApprove = async (id, checked) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/class-bookings/${id}/admin-approve`,
        { approved: checked }
      );
      fetchBookings();

      setBookings((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, adminApproved: checked } : b
        )
      );
    } catch (err) {
      alert("Failed to update approval");
    }
  };


  const getStatusStyle = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "pending_schedule":
        return "bg-yellow-100 text-yellow-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "terminated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  function formatProgress(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}:${m.toString().padStart(2, "0")}`;
  }



  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">📚 All Bookings</h1>
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            ➕ Book Class
          </button>
        </div>

        <DemoControlPanel />

        {loading ? (
          <p className="text-gray-500">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">No bookings found.</p>
        ) : (
          <div className="overflow-x-auto w-full bg-white rounded-lg shadow-md border">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Booking ID</th>
                  <th className="px-4 py-2">Mentor</th>
                  <th className="px-4 py-2">Student</th>
                  <th className="px-4 py-2">Classes Done</th>
                  <th className="px-4 py-2">Fees</th>
                  <th className="px-4 py-2">Payment</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Approve</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((b) => (
                  <tr key={b._id} className="border-b">

                    {/* Booking ID + Parent Approved badge */}
                    <td className="px-4 py-2 font-mono text-xs flex flex-col gap-1 items-start">
                      {b.demoStatus == "running" && b.classesRecord ? <label className="bg-green-100 text-green-700 border border-green-300 px-2">
                        New Demo Booking
                      </label> : b.classesRecord ? <label className="bg-green-100 text-green-700 border border-green-300 px-2">
                        New Session Booking
                      </label> : null}
                      {b._id}

                      {b.parentCompletion && (
                        <span className="text-green-600 text-[10px] font-semibold bg-green-100 px-2 py-[2px] rounded">
                          Parent Approved
                        </span>
                      )}
                    </td>

                    {/* Mentor Name + Phone */}
                    <td className="px-4 py-2 text-xs">
                      {/* Current Mentor */}
                      <div className="font-semibold">{b.mentor?.fullName}</div>
                      <div className="text-green-600 text-[10px] bg-green-100 px-2 py-[2px] rounded w-fit">
                        {b.mentor?.phone}
                      </div>

                      {/* If teacher changed earlier */}
                      {b.teacherHistory && b.teacherHistory.length > 0 && (
                        <div className="mt-2 border-t pt-2">
                          <div className="text-[11px] font-bold">Previous Teachers:</div>

                          {b.teacherHistory.map((t, i) => (
                            <div key={i} className="mt-1 text-[11px] bg-gray-100 p-2 rounded border">
                              <div>👤 <strong>{t.teacherName}</strong></div>
                              <div>🎯 Classes Taken: <strong>{t.classesTaken}</strong></div>
                              <div>💰 Amount Payable: <strong>₹{t.amountToPay}</strong></div>
                              <div className="text-[10px] text-gray-600">
                                Switched At: {new Date(t.switchedAt).toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    {/* Student Name */}
                    <td className="px-4 py-2 flex flex-col text-xs">
                      <span className="font-semibold">{b.studentName || "N/A"}</span>

                      <span className="text-blue-600 bg-blue-100 px-2 py-[2px] rounded w-fit text-[10px] mt-1">
                        {b.parent?.phone || "N/A"}
                      </span>
                    </td>

                    {/* Classes Completed */}
                    <td className="px-4 py-2">
                      <label>{formatProgress(b.progress || 0)} / {b.duration || 22}</label>
                      {/* Demo Badge */}
                      {b.demoStatus == "running" ? (
                        <label className="bg-purple-100 text-purple-700 border border-purple-300 ml-2">
                          Demo
                        </label>
                      ) : b.demoStatus == "completed" ? <label className="bg-purple-100 text-purple-700 border border-purple-300 ml-2">
                        Demo Completed
                      </label> : null}
                      <br></br>
                      <ClassRecordView classBooking={b} />

                    </td>

                    {/* Fees */}
                    <td className="px-4 py-2">
                      <label className={`${(b.progress / 60) >= b.duration ? "text-green-600" : "text-orange-600"}`}>
                        ₹ {b.price == 0 ? 0 : (b.progress / 60) >= b.duration ? ((b.mentor.teachingModes.homeTuition.monthlyPrice / 22) * b.progress / 60).toFixed(0) : ((b.mentor.teachingModes.homeTuition.monthlyPrice / b.duration) * b.progress / 60).toFixed(0)}
                      </label>
                      /
                      ₹{b.price}
                    </td>

                    {/* Payment method + reference */}
                    <td className="px-4 py-2 text-xs">
                      <span
                        className={`px-2 py-[2px] rounded font-semibold ${
                          b.paymentMethod === "manual"
                            ? "bg-yellow-100 text-yellow-800"
                            : b.paymentMethod === "cash"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {b.paymentMethod || "online"}
                      </span>
                      <span
                        className={`ml-1 px-2 py-[2px] rounded font-semibold ${
                          b.teachingMode === "online"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {b.teachingMode || "offline"}
                      </span>
                      {b.paymentReference && (
                        <div className="mt-1 text-[10px] text-gray-700 break-all">
                          Ref: <strong>{b.paymentReference}</strong>
                        </div>
                      )}
                      {b.paymentScreenshot && (
                        <div className="mt-1">
                          <a
                            href={b.paymentScreenshot}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-block"
                            title="View payment screenshot"
                          >
                            <img
                              src={b.paymentScreenshot}
                              alt="Payment screenshot"
                              className="h-12 w-12 object-cover rounded border hover:opacity-90"
                            />
                          </a>
                          <div className="text-[10px] text-blue-600 underline mt-0.5">
                            <a href={b.paymentScreenshot} target="_blank" rel="noreferrer">
                              View screenshot
                            </a>
                          </div>
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-2 flex flex-col gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                          b.status
                        )}`}
                      >
                        {b.status}
                      </span>
                      <span
                        className={`px-2 py-[2px] rounded-full text-[10px] font-semibold w-fit ${
                          b.adminApproved
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {b.adminApproved ? "Approved" : "Pending"}
                      </span>
                      {b.status == "terminated" &&
                        <label className="text-blue-600 bg-blue-100 px-2 py-[2px] rounded w-fit text-[12px]">
                          Refund : Rs. {b.refundAmount.toFixed(0)}
                        </label>}
                    </td>

                    {/* Admin Approve Checkbox */}
                    <td className="px-4 py-2">
                      <input
                        type="checkbox"
                        checked={b.adminApproved || false}
                        onChange={(e) =>
                          handleAdminApprove(b._id, e.target.checked)
                        }
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        onClick={() => alert("Open booking view modal")}
                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        History
                      </button>
                      <button
                        onClick={() => handleDelete(b._id)}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black opacity-50 absolute w-full h-full"></div>
            <div className="bg-white p-6 rounded-xl w-full max-w-lg relative shadow-lg">
              <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>

              <DirectBookingForm />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
