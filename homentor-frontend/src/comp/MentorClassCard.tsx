import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    Calendar,
    Star
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { usePaymentFlow } from "@/hooks/usePaymentFlow";
import { Badge } from "@/components/ui/badge";
import ParentAttendanceModal from "./ParentAttendanceModal";
import ScheduleModal from "./SetScheduleForm";
import AttendanceModal from "./AttendanceModal";
import axios from "axios";
import HistoryAttendanceModal from "./HistoryAttendanceModal";

// Helper functions
const getStatusColor = (status) => {
    switch (status) {
        case "completed":
            return "bg-green-100 text-green-800";
        case "scheduled":
            return "bg-blue-100 text-blue-800";
        case "running":
            return "bg-orange-100 text-orange-800";
        case "pending_schedule":
            return "bg-yellow-100 text-yellow-800";
        case "terminated":
            return "bg-red-100 text-red-800";
        default:
            return "bg-gray-100 text-gray-800";
    }
};

const getStatusText = (status) => {
    switch (status) {
        case "completed":
            return "Completed";
        case "scheduled":
            return "Scheduled";
        case "running":
            return "Running";
        case "pending_schedule":
            return "Schedule Pending";
        case "terminated":
            return "Terminated";
        default:
            return "Unknown";
    }
};

export default function MentorClassCard({ classItem, mentorDetail, userType }) {
    const [openModal, setOpenModal] = useState(false);
    const mentor = classItem?.mentor;
    const [sessionType, setSessionType] = useState("monthly"); // "monthly" | "hourly"
    const [selectedHours, setSelectedHours] = useState(1);
    const [bookings, setBookings] = useState(null)
    const monthlyPrice =
        mentor?.teachingModes?.homeTuition?.finalPrice || classItem.price;

    const hourlyPrice =
        mentor?.teachingModes?.homeTuition?.hourlyPrice || 500; // default hourly price

    const totalHourlyPrice = selectedHours * hourlyPrice;
    console.log(JSON.stringify(mentor))

    // ------------- PAYMENT FLOW (popup → online / UPI+screenshot / cash) -------------
    const { start: startPayment, ui: paymentUI } = usePaymentFlow({ defaultOnlineProvider: "payu" });
    const payNow = () => {
        startPayment({
            amount: sessionType === "hourly" ? totalHourlyPrice : monthlyPrice,
            mentorId: mentor._id,
            duration: sessionType === "hourly" ? selectedHours : 22,
            session: classItem.isDemo ? null : (classItem?.session + 1),
            isDemo: classItem.isDemo,
            classBookingId: classItem._id,
        });
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

    const formatDateTime = (isoDate: string) => {
        return new Intl.DateTimeFormat("en-IN", {
            dateStyle: "medium", // e.g., Aug 2, 2025
            timeStyle: "short", // e.g., 3:09 PM
            timeZone: "Asia/Kolkata", // To adjust for Indian time
        }).format(new Date(isoDate));
    };

    const fetchBookings = async () => {
        try {
          if (!mentorDetail?._id) return;
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/class-bookings/mentor/${mentorDetail._id}`
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
        } 
      };


    return (
        <>
            <Card
                key={classItem._id}
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



            {/* ----------- BOOKING MODAL ----------- */}
            <Dialog open={openModal} onOpenChange={setOpenModal}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirm Your Next Session</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Mentor Details */}
                        <div className="flex items-center gap-4 p-3 border rounded-lg">
                            <img
                                src={mentor?.profilePhoto}
                                className="w-12 h-12 rounded-full object-cover"
                                alt=""
                            />
                            <div>
                                <p className="font-semibold text-lg">{mentor?.fullName}</p>
                                <p className="text-sm text-gray-600">{mentor?.phone}</p>
                            </div>
                        </div>

                        {/* Session Type Selector */}
                        <div className="flex gap-3 mt-3">
                            <Button
                                variant={sessionType === "monthly" ? "default" : "outline"}
                                onClick={() => setSessionType("monthly")}
                            >
                                Monthly Session
                            </Button>

                            <Button
                                variant={sessionType === "hourly" ? "default" : "outline"}
                                onClick={() => setSessionType("hourly")}
                            >
                                Hourly Session
                            </Button>
                        </div>

                        {/* Monthly Price */}
                        {sessionType === "monthly" && (
                            <div className="p-3 border rounded-lg">
                                <p className="font-medium">Monthly Price:</p>
                                <p className="text-lg font-semibold text-blue-600">
                                    ₹{monthlyPrice}
                                </p>
                            </div>
                        )}

                        {/* Hourly Price */}
                        {sessionType === "hourly" && (
                            <div className="p-3 border rounded-lg space-y-3">
                                <p className="font-medium">Price Per Hour:</p>
                                <p className="text-lg font-semibold text-green-600">
                                    ₹{hourlyPrice}
                                </p>

                                <div>
                                    <p className="font-medium">Enter Hours:</p>
                                    <input
                                        type="number"
                                        min="1"
                                        className="w-full mt-1 px-3 py-2 border rounded-lg"
                                        value={selectedHours}
                                        onChange={(e) => setSelectedHours(Number(e.target.value))}
                                        placeholder="Enter number of hours"
                                    />
                                </div>

                                <p className="font-medium mt-3">Total Price:</p>
                                <p className="text-lg font-semibold text-blue-600">
                                    ₹{totalHourlyPrice}
                                </p>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button onClick={payNow} className="bg-blue-600 text-white">
                            Confirm Booking
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {paymentUI}
        </>
    );
}
