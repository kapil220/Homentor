export function ClassBookingCard({ booking, userType }) {
  const statusColor = {
    running: "bg-green-100 text-green-700",
    completed: "bg-gray-100 text-gray-700",
    terminated: "bg-red-100 text-red-700",
    demo: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">
            {booking.subject} • Class {booking.class}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {userType === "parent"
              ? `Mentor: ${booking.mentorName}`
              : `Student: ${booking.studentName}`}
          </p>

          <p className="text-sm text-gray-500">
            {new Date(booking.startDate).toLocaleDateString("en-IN")}
          </p>
        </div>

        <span
          className={`px-3 py-1 text-xs rounded-full ${statusColor[booking.status]}`}
        >
          {booking.status.toUpperCase()}
        </span>
      </div>

      {/* Actions */}
      <div className="mt-4 flex gap-3 flex-wrap">
        <button className="text-sm text-blue-600">
          View Details
        </button>

        {booking.status === "terminated" && userType === "parent" && (
          <span className="text-sm text-green-700">
            Refund: ₹{booking.refundAmount}
          </span>
        )}

        {booking.status === "completed" && userType === "mentor" && (
          <span className="text-sm text-blue-700">
            Earnings: ₹{booking.mentorPay}
          </span>
        )}
      </div>
    </div>
  );
}
