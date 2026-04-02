import { useState, useEffect } from "react";
import axios from "axios";

export default function DirectBookingForm() {
  const [mentors, setMentors] = useState([]);
  const [formData, setFormData] = useState({
    parentId: "",
    mentorId: "",
    studentName: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: ""
    },
    subject: "",
    className: "",
    school: "",
    date: "",
    time: "",
    duration: "",
    amount: "",
    paymentMode: "cash",
  });

  const updateAddress = (key, value) => {
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [key]: value
      }
    }));
  };

  useEffect(() => {
    axios.get("https://homentor-backend.onrender.com/api/mentor/approved-mentors").then((res) => setMentors(res.data.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://homentor-backend.onrender.com/api/class-bookings/manual-booking", formData);
      alert("Class booked successfully!");
      setFormData({
        parentId: "",
        mentorId: "",
        subject: "",
        className: "",
        school: "",
        date: "",
        time: "",
        duration: "",
        amount: "",
        paymentMode: "cash",
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          pincode: ""
        },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to book class");
    }
  };

  console.log(formData)

  return (
    <div className="h-[90vh]  p-4 bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="p-6 bg-white h-[90vh] overflow-auto rounded-xl  shadow-md w-full max-w-4xl mx-auto"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Direct Class Booking</h2>

        {/* GRID: 2 columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Student Name */}
          <input
            type="text"
            placeholder="Student Name"
            value={formData.studentName}
            onChange={(e) =>
              setFormData({ ...formData, studentName: e.target.value })
            }
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />

          {/* Phone Number */}
          <input
            type="text"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />

          {/* Mentor */}
          <select
            value={formData.mentorId}
            onChange={(e) =>
              setFormData({ ...formData, mentorId: e.target.value })
            }
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Mentor</option>
            {mentors?.map((m) => (
              <option key={m._id} value={m._id}>
                {m.fullName}
              </option>
            ))}
          </select>

          {/* Subject */}
          <input
            type="text"
            placeholder="Subject"
            value={formData.subject}
            onChange={(e) =>
              setFormData({ ...formData, subject: e.target.value })
            }
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />

          {/* Class */}
          <input
            type="text"
            placeholder="Class"
            value={formData.className}
            onChange={(e) =>
              setFormData({ ...formData, className: e.target.value })
            }
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />

          {/* School */}
          <input
            type="text"
            placeholder="School"
            value={formData.school}
            onChange={(e) =>
              setFormData({ ...formData, school: e.target.value })
            }
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />

          {/* Date */}
          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />

          {/* Time */}
          <input
            type="time"
            value={formData.time}
            onChange={(e) =>
              setFormData({ ...formData, time: e.target.value })
            }
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />

          {/* Duration */}
          <input
            type="text"
            placeholder="Duration (e.g., 1 hour)"
            value={formData.duration}
            onChange={(e) =>
              setFormData({ ...formData, duration: e.target.value })
            }
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />

          {/* Amount */}
          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={formData.paymentMode}
            onChange={(e) =>
              setFormData({ ...formData, paymentMode: e.target.value })
            }
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option value="cash">Cash</option>
            <option value="online">Online</option>
            <option value="upi">UPI</option>
            <option value="bank">Bank Transfer</option>
          </select>
        </div>

        {/* Address Section */}
        <h3 className="text-lg font-semibold mt-6 mb-2">Address</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Street"
            value={formData.address.street}
            onChange={(e) => updateAddress("street", e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="City"
            value={formData.address.city}
            onChange={(e) => updateAddress("city", e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="State"
            value={formData.address.state}
            onChange={(e) => updateAddress("state", e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="text"
            placeholder="Pincode"
            value={formData.address.pincode}
            onChange={(e) => updateAddress("pincode", e.target.value)}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
        >
          Book Class
        </button>
      </form>
    </div>

  );
}
