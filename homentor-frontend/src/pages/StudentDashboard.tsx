import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Calendar, DollarSign, Settings, PhoneCall, LogOut } from 'lucide-react';
import NoBookingCard from '@/comp/NoBookingCard';
import axios from 'axios';
import ClassCard from '@/comp/ClassCard';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ParentProfileForm from '@/comp/ParentProfileForm';
import ParentDisclaimerModal from '@/comp/ParentDisclaimerModal';

const MentorDashboard = () => {
  const [userType, setUserType] = useState('parent');
  const studentNumber = localStorage.getItem("usernumber");
  const [studentDetail, setStudentDetail] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  // Address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  const getStudentDetail = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/login-check`,
        { phone: studentNumber }
      );
      setStudentDetail(response.data.data);

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/class-bookings/student/${response.data.data._id}`
      );
      setBookings(res.data.data);

      // 👇 If booking exists and no address, open modal
      if (res.data.data.length > 0 && !response.data.data.address) {
        setShowAddressModal(true);
      }
    } catch (error) {
      console.error("Failed to fetch student", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudentDetail();
    if(studentDetail?.disclaimerAccepted === false && bookings.find(b => b.price > 0)){
      setShowDisclaimer(true);
    }
  }, []);

  const handleSaveAddress = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${studentDetail._id}`,
        { address }
      );
      setShowAddressModal(false);
      // Refresh details
      getStudentDetail();
    } catch (error) {
      console.error("Failed to save address", error);
    }
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("usernumber");
    navigate("/"); // redirect to login page (change if your route differs)
  };
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar></Navbar>
      <div className="container mx-auto px-4 py-8 mt-[8vh]">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className='flex flex-row justify-between'>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {userType === "parent" ? "Parent" : "Mentor"} Dashboard
                </h1>
                <p className="text-gray-600 mt-1 text-sm sm:text-base">
                  Manage your students and upcoming sessions
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </Button>
            </div>

            <div className="flex gap-2 w-full sm:w-auto justify-end sm:justify-start">
              <Button onClick={() => setShowProfileForm(true)} variant="outline" size="sm" className="w-full sm:w-auto">

                Edit Profile

              </Button>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                <PhoneCall className="w-4 h-4 mr-2" />
                <span className=" sm:inline">9203149956</span>
              </Button>
            </div>
          </div>
        </div>
        {studentDetail && (
          <ParentProfileForm
            open={showProfileForm}
            onClose={() => setShowProfileForm(false)}
            userId={studentDetail._id}
            initialData={studentDetail}
          />
        )}
        {/* Booked Classes */}
        <Tabs defaultValue="classes" className="space-y-4">
          <TabsContent value="classes" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Heading */}
              <h2 className="text-xl font-semibold text-gray-900">
                Your Booked Classes
              </h2>

              {/* Action Button */}
              <button
                onClick={() => navigate("/parent/bookings")}
                className="px-4 py-2 text-sm font-medium rounded-lg
               bg-blue-600 text-white hover:bg-blue-700
               transition-all w-full sm:w-auto"
              >
                View All Bookings
              </button>
            </div>
            {bookings.length === 0 ?
              <NoBookingCard /> :
              <div className="space-y-4">
                {bookings.map((classItem) => (
                  <ClassCard classItem={classItem} userType="parent" key={classItem._id} />
                ))}
              </div>
            }
          </TabsContent>
        </Tabs>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
            <h2 className="text-xl font-semibold mb-4">Enter Your Address</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Street Address"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Pincode"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
              />
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
      <div className='flex items-center justify-center py-3'>
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
    </div>
  );
};

export default MentorDashboard;
