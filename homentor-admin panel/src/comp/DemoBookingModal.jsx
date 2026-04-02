import React, { useState } from "react";
import axios from "axios";

const DemoBookingModal = ({ mentor, onClose, getMentorData }) => {
  const [parentPhone, setParentPhone] = useState("");
  const [studentName, setStudentName] = useState("");
  const [address, setAddress] = useState("");
  const [fee, setFee] = useState("Free");

  const handleBook = async () => {
    try {
      await axios.post("https://homentor-backend.onrender.com/api/demo-booking", {
        mentorId: mentor._id,
        parentPhone,
        studentName,
        address,
        fee: fee === "Free" ? 0 : 99,
      });
      alert("Demo booked successfully!");
      getMentorData();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to book demo");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
        <h3 className="text-lg font-bold mb-4">
          Book Demo with {mentor.fullName}
        </h3>
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Parent Phone"
            value={parentPhone}
            onChange={(e) => setParentPhone(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            placeholder="Student Name"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            placeholder="Parent Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          />
          <select
            value={fee}
            onChange={(e) => setFee(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            <option>Free</option>
            <option>₹99</option>
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleBook}
            className="px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoBookingModal;
