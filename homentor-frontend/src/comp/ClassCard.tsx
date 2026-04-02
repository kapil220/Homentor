import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { createOrder } from "@/api/payment.jsx";
import { load } from "@cashfreepayments/cashfree-js";
import { Badge } from "@/components/ui/badge";
import ParentAttendanceModal from "./ParentAttendanceModal";

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

export default function ClassCard({ classItem, userType }) {
  const [openModal, setOpenModal] = useState(false);
  const mentor = classItem?.mentor;
  const [sessionType, setSessionType] = useState("monthly"); // "monthly" | "hourly"
  const [selectedHours, setSelectedHours] = useState(1);

  const monthlyPrice = mentor?.teachingModes?.homeTuition?.finalPrice;

  const hourlyPrice = (mentor?.teachingModes?.homeTuition?.finalPrice/22).toFixed(0) || 500; // default hourly price

  const totalHourlyPrice = selectedHours * hourlyPrice;
  console.log(JSON.stringify(mentor));

  // ------------- PAYMENT FUNCTION (CASHFREE) -------------
  const payNow = async () => {
    try {
      const data = await createOrder({
        amount: sessionType === "hourly" ? totalHourlyPrice : monthlyPrice,
        customerId: `homentor${Date.now()}`,
        customerPhone: localStorage.getItem("usernumber"),
        mentorId: mentor._id,
        duration: sessionType === "hourly" ? selectedHours : 22,
        session: classItem.isDemo ? null : classItem?.session + 1,
        isDemo: classItem.isDemo,
        classBookingId: classItem._id,
      });
      localStorage.setItem("orderId", data.order_id);
      console.log(data);
      let cashfree = await load({
        mode: "production",
      });
      console.log(cashfree);

      let checkoutOptions = {
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",
      };
      cashfree.checkout(checkoutOptions);
    } catch (error) {
      alert("Failed to initiate payment");
    }
  };

  const formatDateTime = (isoDate: string) => {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "medium", // e.g., Aug 2, 2025
      timeStyle: "short", // e.g., 3:09 PM
      timeZone: "Asia/Kolkata", // To adjust for Indian time
    }).format(new Date(isoDate));
  };

  return (
    <>
      <Card key={classItem.id} className="hover:shadow-md transition-shadow">
        <CardContent className="py-4 px-2">
          <div className="flex lg:flex-row gap-2 flex-col items-start justify-between">
            <div className="flex flex-wrap gap-2">
              <Badge className={getStatusColor(classItem.status)}>
                {getStatusText(classItem.status)}
              </Badge>
              {/* Demo Badge */}
              {classItem.demoStatus == "running" ? (
                <Badge className="bg-purple-100 text-purple-700 border border-purple-300">
                  Demo
                </Badge>
              ) : classItem.demoStatus == "completed" ? (
                <Badge className="bg-purple-100 text-purple-700 border border-purple-300">
                  Demo Completed
                </Badge>
              ) : null}
              {classItem.demoStatus == "running" &&
              classItem.classesRecord.length == 0 ? (
                <Badge className="bg-green-100 text-green-700 border border-green-300">
                  New Demo Booking
                </Badge>
              ) : classItem.classesRecord.length == 0 ? (
                <Badge className="bg-green-100 text-green-700 border border-green-300 ">
                  New Session Booking
                </Badge>
              ) : null}
            </div>
            <div className="flex items-start space-x-4">
              <img
                src={classItem?.mentor?.profilePhoto}
                alt={classItem?.mentor?.fullName}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">
                    {" "}
                    {classItem?.mentor?.fullName}
                  </h3>
                </div>

                <p className="text-gray-600 mb-1">
                  Mobile No : {classItem?.mentor?.phone}
                </p>
              </div>
            </div>
            {classItem.scheduledDate && (
              <div className="mt-2 p-2 bg-green-50 rounded-md">
                <p className="text-sm text-green-800">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Scheduled for {formatDateTime(classItem.scheduledDate)}
                </p>
              </div>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <label>Classes: </label>
                <label className="text-orange-500">
                  {" "}
                  {Math.floor(classItem?.progress / 60)}{" "}
                </label>{" "}
                / {classItem.duration}
              </span>
              <span>Booked: {formatDateTime(classItem.bookedDate)}</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <h5 className="font-semibold text-lg">
                Student Name: {classItem?.studentName}
              </h5>
            </div>
            <p className="text-gray-600 mb-1">Class : {classItem?.class}</p>
            <p className="text-gray-600 mb-1">School : {classItem?.school}</p>
            <p className="text-gray-600 mb-1">Subject : {classItem?.subject}</p>
            {classItem.status === "terminated" && (
              <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm font-semibold text-green-800">
                  Refund Details
                </p>
                <div className="flex text-sm gap-1 mt-1">
                  <span>Booking Amount: </span>
                  <span className="font-semibold text-green-700">
                    ₹{classItem.price}
                  </span>
                </div>
                <div className="flex text-sm gap-1 mt-1">
                  <span>Refundable Amount: </span>
                  <span className="font-semibold text-green-700">
                    ₹{classItem.refundAmount}
                  </span>
                </div>
                <div className="flex  text-sm gap-1 mt-1">
                  <span>Classes Attend: </span>
                  <span className="font-semibold text-green-700">
                    {classItem.remainingClasses}
                  </span>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {classItem.status === "scheduled" ||
              classItem.status == "running" ? (
                <ParentAttendanceModal
                  classBooking={classItem}
                  modalType=" View Sheet"
                />
              ) : classItem.status == "completed" ? (
                <ParentAttendanceModal
                  classBooking={classItem}
                  modalType=" Sheet Completed"
                />
              ) : null}
              {classItem.status === "completed" && !classItem.isDemo && (
                <div className="flex gap-2">
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => setOpenModal(true)}
                  >
                    Book Next Session
                  </Button>
                </div>
              )}
              {classItem.isDemo && classItem.status != "pending_schedule" && (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setOpenModal(true)}
                >
                  Continue Session
                </Button>
              )}
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
    </>
  );
}
