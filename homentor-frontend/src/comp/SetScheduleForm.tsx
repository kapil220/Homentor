import { Button } from "@/components/ui/button";
import axios from "axios";
import { Calendar } from "lucide-react";
import { useState } from "react";

export default function ScheduleModal({classBooking, getBookings}) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: "",
    studentName: "",
    class: "",
    school: "",
    scheduledDate: "",
    scheduledTime: "",
    status: "scheduled"
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    try {
          const response = await axios.put(
            `${import.meta.env.VITE_API_URL}/api/class-bookings/booking/${classBooking?._id}`,
            {
              ...formData
            }
          );
          await getBookings()
          console.log(response.data.data);
        } catch (error) {
          console.error("Failed to fetch bookings", error);
        } finally {
          setIsOpen(false)
        }
    // Submit to backend
    ; // Close modal after submit
  };

  return (
    <>
      {/* Trigger Button */}
      
        <Button onClick={() => setIsOpen(true)} size="sm">
          <Calendar className="w-4 h-4 mr-2" />
          Set Schedule
        </Button>
      

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6 relative animate-fadeIn">
            {/* Close Button */}
            <button
              className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold text-center mb-4">
              📅 Set Class Schedule
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-medium">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Science"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-medium">Student Name</label>
                <input
                  type="text"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  placeholder="e.g., Aarav"
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium">Class</label>
                  <input
                    type="text"
                    name="class"
                    value={formData.class}
                    onChange={handleChange}
                    placeholder="e.g., 6th"
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium">School</label>
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    placeholder="e.g., DPS"
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium">Date</label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium">Time</label>
                  <input
                    type="time"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Save Schedule
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
