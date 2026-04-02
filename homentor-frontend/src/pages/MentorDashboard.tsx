import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  DollarSign,
  BookOpen,
  Star,
  LogOut,
} from "lucide-react";
import axios from "axios";
import ScheduleModal from "@/comp/SetScheduleForm";
import AttendanceModal from "@/comp/AttendanceModal";
import HistoryAttendanceModal from "@/comp/HistoryAttendanceModal"
import EditMentorForm from "@/comp/EditMentorForm";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import MentorSecondForm from "@/comp/MentorSecondForm";
import ParentDisclaimerModal from "@/comp/ParentDisclaimerModal";

const MentorDashboard = () => {
  const [userType, setUserType] = useState("mentor");
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  const [showFormEdit, setShowFormEdit] = useState(false);
  const [mentorId, setMentorId] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mentorDetail, setMentorDetail] = useState({
    _id: "",
    fullName: "",
    profilePhoto: "",
    phone: ""
  });

  const fetchBookings = async () => {
    try {
      if (!mentorDetail?._id) return;
      const response = await axios.get(
        `https://homentor-backend.onrender.com/api/class-bookings/mentor/${mentorDetail._id}`
      );
      const currentMentorId = mentorDetail._id.toString();

      // First, process all bookings to find duplicates
      const bookingMap = new Map();

      response.data.data.forEach(booking => {
        const bookingId = booking._id;
        const existingBooking = bookingMap.get(bookingId);
        const activeMentorId = booking.mentor?._id?.toString() || booking.mentor?.toString();
        const isActiveMentor = activeMentorId === currentMentorId;

        // If we already have this booking and it's already marked as ACTIVE, skip
        if (existingBooking?.mentorViewType === 'ACTIVE') {
          return;
        }

        // Only look for history entries if the mentor is not the active mentor
        const historyEntry = isActiveMentor
          ? null
          : booking.teacherHistory?.find(h => h.teacherId?.toString() === currentMentorId);

        console.log('Mentor view determination:', {
          bookingId: booking._id,
          isActiveMentor,
          hasHistoryEntry: !!historyEntry,
          teacherHistory: booking.teacherHistory
        });

        const mentorViewType = isActiveMentor ? "ACTIVE" : historyEntry ? "REPLACED" : "UNKNOWN";

        bookingMap.set(bookingId, {
          ...booking,
          mentorViewType
        });
      });

      // Convert the map values back to an array
      const uniqueBookings = Array.from(bookingMap.values());

      setBookings(uniqueBookings);
      console.log('Processed bookings:', uniqueBookings);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-green-100 text-green-800";
      case "pending_schedule":
        return "bg-yellow-100 text-yellow-800";
      case "running":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "terminated":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Scheduled";
      case "pending_schedule":
        return "Awaiting Schedule";
      case "running":
        return "Running";
      case "completed":
        return "Completed";
      case "terminated":
        return "Terminated";
      default:
        return status;
    }
  };

  const getMentorDetail = async () => {
    try {
      const res = await axios.post(
        `https://homentor-backend.onrender.com/api/mentor/login-check`,
        { phone: localStorage.getItem("mentor") }
      );
      console.log('Mentor details:', res.data.data);
      const mentorData = res.data.data;
      setMentorId(mentorData._id);
      setMentorDetail(mentorData);
      setIsOn(mentorData?.showOnWebsite);

      const response = await axios.get(
        `https://homentor-backend.onrender.com/api/class-bookings/mentor/${mentorData._id}`
      );

      const currentMentorId = mentorData._id.toString();
      const bookingMap = new Map();

      response.data.data.forEach(booking => {
        const bookingId = booking._id;
        const existingBooking = bookingMap.get(bookingId);
        const activeMentorId = booking.mentor?._id?.toString() || booking.mentor?.toString();
        const isActiveMentor = activeMentorId === currentMentorId;

        // If we already have this booking and it's already marked as ACTIVE, skip
        if (existingBooking?.mentorViewType === 'ACTIVE') {
          return;
        }

        // Only look for history entries if the mentor is not the active mentor
        const historyEntry = isActiveMentor
          ? null
          : booking.teacherHistory?.find(h => h.teacherId?.toString() === currentMentorId);

        console.log('Mentor view determination (getMentorDetail):', {
          bookingId: booking._id,
          isActiveMentor,
          hasHistoryEntry: !!historyEntry,
          teacherHistory: booking.teacherHistory
        });

        const mentorViewType = isActiveMentor ? "ACTIVE" : historyEntry ? "REPLACED" : "UNKNOWN";

        bookingMap.set(bookingId, {
          ...booking,
          mentorViewType
        });
      });

      // Convert the map values back to an array
      const uniqueBookings = Array.from(bookingMap.values());

      setBookings(uniqueBookings);
      console.log("Processed bookings (getMentorDetail):", uniqueBookings);


    } catch (err) {
      console.error("Failed to fetch availability");
    }
  };

  useEffect(() => {
    getMentorDetail();
  }, []);
  const [isOn, setIsOn] = useState(false);

  const updateMentorDetail = async (websiteStatus) => {
    try {
      const res = await axios.put(
        `https://homentor-backend.onrender.com/api/mentor/${mentorDetail._id}`,
        { showOnWebsite: websiteStatus }
      );
      console.log(res.data.data);
      getMentorDetail();
    } catch (err) {
      console.error("Failed to fetch availability");
    }
  };
  const formatDateTime = (isoDate: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium", // e.g., Aug 2, 2025
      timeStyle: "short", // e.g., 3:09 PM
      timeZone: "Asia/Kolkata", // To adjust for Indian time
    }).format(new Date(isoDate));
  };
  
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("mentor");
    navigate("/"); // redirect to login page (change if your route differs)
  };

  function AddressBlock({ classItem }) {
    const [showAddress, setShowAddress] = useState(
      classItem.status !== "running"
    );

    useEffect(() => {
      if (classItem.status === "running" || classItem.status == "completed") {
        setShowAddress(false);
      }
    }, [classItem.status]);

    if (!classItem.parent?.address) return null;

    return (
      <div className="mt-2">
        {/* Toggle button ONLY when running */}
        {classItem.status === "running" || classItem.status == "completed" ? (
          <Button
            size="sm"
            variant="outline"
            className="mb-2"
            onClick={() => setShowAddress((prev) => !prev)}
          >
            {showAddress ? "Hide Address" : "View Address"}
          </Button>
        ) : null}

        {/* Address */}
        {showAddress && (
          <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <h4 className="font-medium text-yellow-700 mb-1">
              Address
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {classItem.parent.address.street},{" "}
              {classItem.parent.address.city},{" "}
              {classItem.parent.address.state} -{" "}
              {classItem.parent.address.pincode}
            </p>
          </div>
        )}
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar></Navbar>
      <div className="container mx-auto px-4 py-8 mt-[8vh]">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Title and Subheading */}
            <div className="flex items-center gap-4">
              <img
                src={mentorDetail?.profilePhoto || "/placeholder.svg"}
                alt="mentor profile"
                className="w-16 h-16 rounded-full border object-cover"
              />
              <div>
                <p className="font-semibold text-lg">
                  {mentorDetail?.fullName}
                </p>
                <p className="text-sm text-gray-500">ID: {mentorDetail?._id.slice(0, 10)}</p>
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

            {/* Actions */}
            <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <Button variant="secondary" onClick={() => setShowFormEdit(true)}>
                Form Edit
              </Button>
              <MentorSecondForm mentorId={mentorDetail._id} phone={mentorDetail?.phone}></MentorSecondForm>
              <div className="flex flex-col items-center ">
                <label className="text-gray-700 font-medium ">
                  Display
                </label>
                <button
                  onClick={() => updateMentorDetail(!isOn)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${isOn ? "bg-green-500" : "bg-gray-300"
                    }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${isOn ? "translate-x-6" : "translate-x-1"
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {userType === "parent" ? "Total Sessions" : "Active Students"}
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">
                {/* {userType === "parent" ? "+2 this month" : "+5 this month"} */}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earned
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Rs.0</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">--</div>
              <p className="text-xs text-muted-foreground">
                {userType === "parent" ? "From mentors" : "From students"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Edit Form */}
        {showFormEdit && (
          <EditMentorForm
            mentorData={mentorDetail}
            onClose={() => setShowFormEdit(false)}
            onSave={getMentorDetail}
          />
        )}

        {/* Main Content */}
        <Tabs defaultValue="classes" className="space-y-4">
          <TabsContent value="classes" className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              {/* Heading */}
              <h2 className="text-xl font-semibold text-gray-900">
                Your Booked Classes
              </h2>

              {/* Action Button */}
              <button
                onClick={() => navigate("/mentor/bookings")}
                className="px-4 py-2 text-sm font-medium rounded-lg
               bg-blue-600 text-white hover:bg-blue-700
               transition-all w-full sm:w-auto"
              >
                View All Bookings
              </button>
            </div>

            {bookings.length == 0 ? (
              <div className="w-full max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-md border border-gray-200 text-center">

                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  No Classes Scheduled
                </h2>
                <p className="text-gray-500 mb-4">
                  You don’t have any upcoming classes at the moment. Once you
                  schedule a class, it will appear here.
                </p>
                <button className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                  Schedule a Class
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((classItem, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="px-3 py-3">
                      <div className="flex flex-col gap-4 items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className="flex-1">
                            <Badge className={getStatusColor(classItem.status)}>
                              {getStatusText(classItem.status)}
                            </Badge>
                            {classItem.mentorViewType == "REPLACED" ? (
                              <Badge className="bg-red-100 text-red-700 border border-red-300">
                                Replaced
                              </Badge>
                            ) : null}
                            {/* Demo Badge */}
                            {classItem.demoStatus == "running" ? (
                              <Badge className="bg-purple-100 text-purple-700 border border-purple-300">
                                Demo
                              </Badge>
                            ) : classItem.demoStatus == "completed" ? <Badge className="bg-purple-100 text-purple-700 border border-purple-300 ">
                              Demo Completed
                            </Badge> : null}

                            {classItem.demoStatus == "running" && classItem.classesRecord.length == 0 ? <Badge className="bg-green-100 text-green-700 border border-green-300">
                              New Demo Booking
                            </Badge> : classItem.classesRecord.length == 0 ? <Badge className="bg-green-100 text-green-700 border border-green-300">
                              New Session Booking
                            </Badge> : null}
                            <div>Session - {classItem.session}</div>
                            <div className="flex flex-col gap-2 my-1">
                              <h3 className="font-semibold ">
                                Name: {classItem?.studentName}
                              </h3>
                              <p className="text-gray-600 ">
                                Mobile : {classItem?.parent?.phone}
                              </p>
                              <p className="text-gray-600 ">
                                Class : {classItem?.class}
                              </p>
                              <p className="text-gray-600 ">
                                School : {classItem?.school}
                              </p>
                              <p className="text-gray-600">
                                Subject : {classItem?.subject}
                              </p>
                            </div>

                            {/* 📍 Show Address Here */}
                            <AddressBlock classItem={classItem} />
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <label>Classes: </label>
                                {classItem.duration}
                              </span>

                              <span>
                                Booked: {formatDateTime(classItem.bookedDate)}
                              </span>
                            </div>
                            {classItem.scheduledDate && (
                              <div className="mt-2 p-2 bg-green-50 rounded-md">
                                <p className="text-sm text-green-800">
                                  <Calendar className="w-4 h-4 inline mr-1" />
                                  Scheduled for{" "}
                                  {formatDateTime(
                                    classItem.scheduledDate
                                  )}
                                </p>
                              </div>
                            )}
                            {classItem.status === "completed" &&
                              classItem.rating && (
                                <div className="mt-2 flex items-center gap-1">
                                  <span className="text-sm text-gray-600">
                                    Rating:
                                  </span>
                                  {[...Array(classItem.rating)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className="w-4 h-4 text-yellow-400"
                                      fill="currentColor"
                                    />
                                  ))}
                                </div>
                              )}
                          </div>
                        </div>
                        {classItem.mentorViewType === "REPLACED" &&
                          classItem.teacherHistory?.length > 0 && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                              <p className="text-sm font-semibold text-red-800 mb-1">
                                Previous Teacher Summary
                              </p>

                              {classItem.teacherHistory.filter((i) => i.teacherId == mentorDetail._id).map((teacher, idx) => (
                                <div
                                  key={idx}
                                  className="flex flex-wrap gap-4 text-sm text-gray-700 mb-1"
                                >

                                  <span>
                                    Classes Taken:{" "}
                                    <span className="font-semibold">{teacher.classesTaken}</span>
                                  </span>
                                  <span>
                                    Amount:{" "}
                                    <span className="font-semibold text-red-700">
                                      ₹{teacher.amountToPay}
                                    </span>
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}

                        {classItem.status === "terminated" && (
                          <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <p className="text-sm font-semibold text-blue-800">
                              Payment Summary
                            </p>
                            <div className="flex gap-1 text-sm mt-1">
                              <span>Classes Taken - </span>
                              <span className="font-semibold">
                                {classItem.duration - classItem.remainingClasses}
                              </span>
                            </div>

                            <div className="flex gap-1 text-sm mt-1">
                              <span>Amount Payable - </span>
                              <span className="font-semibold text-blue-700">
                                ₹{mentorDetail?.teachingModes?.homeTuition.monthlyPrice / 22 * (classItem.duration - classItem.remainingClasses)}
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="flex flex-col gap-2">
                          {classItem.status === "pending_schedule" && (
                            <ScheduleModal
                              classBooking={classItem}
                              getBookings={fetchBookings}
                            ></ScheduleModal>
                          )}

                          {(classItem.status === "scheduled" || classItem.status === "running") && classItem.mentorViewType != "REPLACED" ?
                            <AttendanceModal
                              classBooking={classItem}

                            /> : null
                          }

                          {classItem.mentorViewType == "REPLACED" || classItem.status == "completed" ? <HistoryAttendanceModal classBooking={classItem}></HistoryAttendanceModal> : null

                          }
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <div className='flex items-center justify-center py-3'>
        <button
          onClick={() => setShowDisclaimer(true)}
          className="text-sm text-gray-500 hover:text-blue-600 underline"
        >
          Disclaimer
        </button>
      </div>

      <ParentDisclaimerModal
        audience={"mentor"}
        open={showDisclaimer}
        onClose={() => setShowDisclaimer(false)}
        userId={mentorDetail?._id}
        disclaimerAccepted={mentorDetail?.disclaimerAccepted}
      />
    </div>
  );
};

export default MentorDashboard;
