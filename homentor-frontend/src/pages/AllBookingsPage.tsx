import { useEffect, useState } from "react";
import axios from "axios";
import { ClassBookingCard } from "@/comp/ClassBookingCard";
import ClassCard from "@/comp/ClassCard";
import MentorClassCard from "@/comp/MentorClassCard";

const STATUS_TABS = [
  { label: "All", value: "all" },
  { label: "Running", value: "running" },
  { label: "Completed", value: "completed" },
  { label: "Terminated", value: "terminated" },
  { label: "Demo", value: "demo" },
];

export default function AllBookingsPage({ userType, userData , userId }) {
  const [bookings, setBookings] = useState([]);
  const [activeStatus, setActiveStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const url =
        userType === "parent"
          ? `/api/class-bookings/parent/${userId}`
          : `/api/class-bookings/mentor/${userId}`;

      const res = await axios.get(
        `https://homentor-backend.onrender.com${url}`
      );
      console.log("bookings", res.data.data)
      setBookings(res.data.data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    const matchStatus =
      activeStatus === "all" || b.status === activeStatus;

    const matchSearch =
      b.subject?.toLowerCase().includes(search.toLowerCase()) ||
      b.mentorName?.toLowerCase().includes(search.toLowerCase()) ||
      b.studentName?.toLowerCase().includes(search.toLowerCase());

    return matchStatus && matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">
          My Classes
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          View and manage all your classes
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by subject, mentor, or student"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-10 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveStatus(tab.value)}
              className={`px-5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${activeStatus === tab.value
                ? "bg-blue-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <p className="text-gray-500">Loading classes...</p>
      ) : filteredBookings.length === 0 ? (
        <p className="text-gray-500">No classes found</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((item) => (
            userType === "parent" ? <ClassCard classItem={item} userType={userType}></ClassCard> : <MentorClassCard mentorDetail={userData} classItem={item} userType={userType}></MentorClassCard>
          ))}
        </div>
      )}
    </div>
  );
}
