import { BookOpen } from "lucide-react"; // Icon better suited for "No Booking"

export default function NoBookingCard() {
  return (
    <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md border border-gray-200 text-center">
      <div className="flex justify-center mb-4">
        <div className="bg-yellow-100 text-yellow-600 rounded-full p-3">
          <BookOpen className="w-8 h-8" />
        </div>
      </div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">
        No Classes Booked Yet
      </h2>
      <p className="text-gray-500 mb-4">
        You haven’t booked any classes for your child yet. Once a booking is made, it will be shown here.
      </p>
      <button className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
        Book a Class Now
      </button>
    </div>
  );
}
