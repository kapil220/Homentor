"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Star } from "lucide-react";
import axios from "axios";
import { usePaymentFlow } from "@/hooks/usePaymentFlow";
import TerminateClassModal from "./TerminateClassModal";
import ChangeTeacherModal from "./ChangeTeacherModal";

export default function ClassInfoCardParent({ classBooking }) {
  const [mentorConfirmed] = useState(classBooking.mentorCompletion);
  const [parentConfirmed, setParentConfirmed] = useState(
    classBooking.parentCompletion
  );
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [terminateOpen, setTerminateOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [changeTeacherOpen, setChangeTeacherOpen] = useState(false);

  // NEW STATES
  const [sessionType, setSessionType] = useState("monthly"); // "monthly" | "hourly"
  const [selectedHours, setSelectedHours] = useState(1);

  const mentor = classBooking?.mentor;

  const monthlyPrice =
    mentor?.teachingModes?.homeTuition?.finalPrice || classBooking.price;

  const hourlyPrice =
    mentor?.teachingModes?.homeTuition?.hourlyPrice || 500; // default hourly price

  const totalHourlyPrice = selectedHours * hourlyPrice;

  // ---------------- Parent Completion Handler ----------------
  const handleParentCheck = async (checked) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/class-bookings/${classBooking._id}/parent-complete`
      );
      setParentConfirmed(checked);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong!");
      setParentConfirmed(false);
    }
  };

  // ------------- PAYMENT FLOW (popup → online / UPI+screenshot / cash) -------------
  const { start: startPayment, ui: paymentUI } = usePaymentFlow({ defaultOnlineProvider: "payu" });
  const payNow = () => {
    startPayment({
      amount: sessionType === "hourly" ? totalHourlyPrice : monthlyPrice,
      mentorId: mentor._id,
      duration: sessionType === "hourly" ? selectedHours : 22,
      session: classBooking.isDemo ? null : (classBooking?.session + 1),
      isDemo: classBooking.isDemo,
      classBookingId: classBooking._id,
    });
  };

  return (
    <>
      {/* ------- MAIN CARD ------- */}
      <Card className="mt-3 w-full shadow-lg rounded-xl p-2">
        <CardHeader className="pb-1">
          <CardTitle className="flex justify-between items-center text-[16px] font-semibold">
            <span>Class Completed:</span>

            <div className="flex gap-4">
              <label className="flex items-center gap-2 opacity-50 cursor-not-allowed">
                <Checkbox disabled checked={mentorConfirmed} />
                Mentor
              </label>

              <label className="flex items-center gap-2">
                <Checkbox
                  disabled={!mentorConfirmed}
                  checked={parentConfirmed}
                  onCheckedChange={(checked) => handleParentCheck(!!checked)}
                />
                Parent
              </label>
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Rating */}
          <div>
            <p className="font-medium mb-1">Rating:</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  onClick={() => setRating(star)}
                  className={`w-6 h-6 cursor-pointer ${star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-400"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Feedback */}
          <div>
            <p className="font-medium mb-1">Feedback:</p>
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write your feedback here..."
              className="min-h-[80px] w-full"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-2 mt-3">
            {classBooking.isDemo ? 
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setOpenModal(true)}
            >
              Continue Session
            </Button> :
            
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setOpenModal(true)}
            >
              Book Next Session
            </Button>}
            

            <div className="flex gap-3">
              {/* Terminate Teacher */}
              <Button
                onClick={() => setTerminateOpen(true)}
                variant="destructive"
                className="px-4 py-2"
              >
                Terminate Teacher
              </Button>

              {/* Change Teacher */}
              <Button
                onClick={() => setChangeTeacherOpen(true)}
                variant="outline"
                className="px-4 py-2 border-mentor-yellow-500 text-mentor-yellow-600"
              >
                Change Teacher
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <TerminateClassModal
        open={terminateOpen}
        onClose={() => setTerminateOpen(false)}
        booking={classBooking}         // pass classBooking
        onTerminate={(payload) => {
          console.log("Terminate Request:", payload);
          
          // call API here
        }}
      />
      <ChangeTeacherModal
        open={changeTeacherOpen}
        onClose={() => setChangeTeacherOpen(false)}
        booking={classBooking}
        backupTeachers={mentor.backupTeachers}   // pass the array
        onChangeTeacher={(teacher) => {
          console.log("Selected new teacher:", teacher);
          // Call API here
        }}
      />

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
