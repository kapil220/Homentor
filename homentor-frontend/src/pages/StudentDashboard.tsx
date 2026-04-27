import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import NoBookingCard from "@/comp/NoBookingCard";
import axios from "axios";
import ClassCard from "@/comp/ClassCard";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import ParentDisclaimerModal from "@/comp/ParentDisclaimerModal";
import StatTile from "@/comp/StatTile";
import { BookOpen, Clock, AlarmClock, Wallet } from "lucide-react";
import {
  isActiveBooking,
  isPendingBooking,
  totalHoursDone,
  moneySpent,
} from "@/lib/dashboardStats";

const StudentDashboard = () => {
  const studentNumber = localStorage.getItem("usernumber");
  const [studentDetail, setStudentDetail] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState({ street: "", city: "", state: "", pincode: "" });
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const navigate = useNavigate();

  const getStudentDetail = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/login-check`,
        { phone: studentNumber }
      );
      setStudentDetail(response.data.data);

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/class-bookings/student/${response.data.data._id}`
      );
      setBookings(res.data.data || []);

      if ((res.data.data || []).length > 0 && !response.data.data.address) {
        setShowAddressModal(true);
      }
    } catch (error) {
      console.error("Failed to fetch student", error);
    }
  };

  useEffect(() => {
    getStudentDetail();
  }, []);

  useEffect(() => {
    if (studentDetail?.disclaimerAccepted === false && bookings.find((b) => b.price > 0)) {
      setShowDisclaimer(true);
    }
  }, [studentDetail, bookings]);

  const handleSaveAddress = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/users/${studentDetail._id}`,
        { address }
      );
      setShowAddressModal(false);
      getStudentDetail();
    } catch (error) {
      console.error("Failed to save address", error);
    }
  };

  const activeCount = bookings.filter(isActiveBooking).length;
  const pendingCount = bookings.filter(isPendingBooking).length;
  const hoursDone = totalHoursDone(bookings);
  const spent = moneySpent(bookings);

  const recent = bookings.slice(0, 3);

  return (
    <DashboardLayout
      role="student"
      title="Overview"
      subtitle="Your classes and bookings at a glance"
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatTile
            label="Active Classes"
            value={activeCount}
            icon={<BookOpen className="w-5 h-5" />}
            accent="blue"
          />
          <StatTile
            label="Pending Approval"
            value={pendingCount}
            icon={<AlarmClock className="w-5 h-5" />}
            accent="yellow"
            hint={pendingCount ? "Awaiting admin approval" : "All clear"}
          />
          <StatTile
            label="Hours Done"
            value={hoursDone}
            icon={<Clock className="w-5 h-5" />}
            accent="green"
          />
          <StatTile
            label="Money Spent"
            value={`₹${spent.toLocaleString()}`}
            icon={<Wallet className="w-5 h-5" />}
            accent="purple"
            hint="Approved bookings"
          />
        </div>

        {/* Recent classes preview */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Classes</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/dashboard/student/classes")}
            >
              View My Classes
            </Button>
          </div>
          {recent.length === 0 ? (
            <NoBookingCard />
          ) : (
            <div className="space-y-4">
              {recent.map((c) => (
                <ClassCard classItem={c} userType="parent" key={c._id} />
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => navigate("/mentors")}>Find a Mentor</Button>
            <Button variant="outline" onClick={() => navigate("/parent/bookings")}>
              All Bookings
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard/student/payments")}>
              Payment History
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard/student/profile")}>
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Address modal */}
      {showAddressModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Enter Your Address</h2>
            <div className="space-y-3">
              {(["street", "city", "state", "pincode"] as const).map((k) => (
                <input
                  key={k}
                  type="text"
                  placeholder={k.charAt(0).toUpperCase() + k.slice(1)}
                  value={address[k]}
                  onChange={(e) => setAddress({ ...address, [k]: e.target.value })}
                  className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                />
              ))}
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setShowAddressModal(false)}
                className="px-4 py-2 rounded-lg border bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAddress}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center py-3">
        <button
          onClick={() => setShowDisclaimer(true)}
          className="text-sm text-gray-500 hover:text-blue-600 underline"
        >
          Disclaimer
        </button>
      </div>

      <ParentDisclaimerModal
        audience={"parent"}
        open={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        userId={studentDetail?._id}
        disclaimerAccepted={studentDetail?.disclaimerAccepted}
      />
    </DashboardLayout>
  );
};

export default StudentDashboard;
