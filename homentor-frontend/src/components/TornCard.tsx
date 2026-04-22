import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { CalendarPlus, MessageCircle, PhoneCall, Star } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginPopup from "./LoginPopup";
import { initiateCheckout } from "@/api/paymentProvider.jsx";
import SuccessModal from "@/comp/SuccessModal";

const TornCard = ({ mentor }) => {
  const [showBookingOptions, setShowBookingOptions] = useState(false);
  const [pendingAction, setPendingAction] = useState({ type: null });
  useEffect(() => {
    getAdminData();
  }, []);
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const handleSelectMentor = () => {
    localStorage.setItem("mentorDetail", JSON.stringify(mentor));
    navigate(`/mentors/${mentor.fullName}`);
  };

  const userNumber = localStorage.getItem("usernumber");
  const [bookingAmount, setBookingAmount] = useState(0);

  const handlePayment = async (fees) => {
    if (!userNumber) {
      setPendingAction({ type: "payment", amount: fees });
      setBookingAmount(fees);
      setIsLoginOpen(true);
      return;
    }

    if (fees === 0) {
      // Free demo → hit your demo booking API directly
      try {
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/demo-booking`,
          {
            mentorId: mentor._id,
            parentPhone: userNumber,
            studentName: "Demo Student", // you can collect name in popup if needed
            address: "Not Provided",
            fee: 0,
            mentorPhone: mentor.phone,
          }
        );
        setShowSuccess(true);
        
      } catch (error) {
        alert("Failed to book demo");
      }
      return;
    }

    // Paid demo or monthly subscription → use gateway
    try {
      await initiateCheckout({
        amount: fees,
        customerId: `homentor${Date.now()}`,
        customerPhone: userNumber,
        mentorId: mentor._id,
      });
    } catch (error) {
      alert("Failed to initiate payment");
    }
  };

  useEffect(() => {
    if (userNumber && pendingAction.type === "PAYMENT") {
      handlePayment(bookingAmount);
    } else if (userNumber && pendingAction.type === "CALL") {
      initiateDirectCall();
    }
  }, [pendingAction]);
  const [callingNo, setCallingNo] = useState("");
  const getAdminData = () => {
    axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin`).then((res) => {
      if (mentor?.callRouting?.mode === "mentor") {
        setCallingNo(mentor?.phone);
      } else {
        setCallingNo(res.data.data[0].callingNo);
      }
    });
  };

  // Direct tel: call. Exotel kept below (disabled) for later re-enable.
  const initiateDirectCall = () => {
    if (!userNumber) {
      setPendingAction({
        type: "call",
        mentorId: mentor._id,
        mentorPhone: mentor.phone,
      });
      setIsLoginOpen(true);
      return;
    }
    const number = callingNo || mentor?.phone;
    if (number) {
      window.location.href = `tel:${number}`;
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const initiateExotelCall = () => {
    if (!userNumber) {
      setPendingAction({
        type: "call",
        mentorId: mentor._id,
        mentorPhone: mentor.phone,
      });
      setIsLoginOpen(true);
      return;
    }
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/exotel/call/initiate`, {
        parentPhone: `0${userNumber}`,
        mentorId: mentor._id,
        mentorPhone: mentor.phone,
      })
      .then((res) => (window.location.href = "tel:07314852387"))
      .catch((err) => console.log(err));
  };

  return (
    <div className="relative w-full flex flex-col bg-[papayawhip] rounded-xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.4)] overflow-hidden hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] transition-all duration-300">
      <SuccessModal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        redirectTo="/dashboard/student"
      />
      {/* 📌 Pin */}
      <div
        className="absolute z-50"
        style={{
          top: "0.5rem",
          left: "50%",
          transform: "translateX(-50%)",
          width: "0.7rem",
          height: "0.7rem",
          backgroundColor: "crimson",
          borderRadius: "50%",
          boxShadow: "-0.1rem -0.1rem 0.3rem rgba(0,0,0,0.4) inset",
        }}
      />

      {/* 🖼 IMAGE STRIP */}
      <div
        onClick={handleSelectMentor}
        className="relative w-full lg:h-[38vh] h-[22vh] overflow-hidden"
      >
        <img
          src={mentor?.profilePhoto || ""}
          alt="mentor"
          onClick={handleSelectMentor}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.04] cursor-pointer"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Rating */}
        <div className="absolute top-2 right-2 z-20">
          <Badge className="bg-white/90 backdrop-blur text-black text-[10px] font-semibold px-2 py-1 flex items-center gap-1 shadow">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            {mentor?.rating || "4.5"}
          </Badge>
        </div>
      </div>

      {/* 🧾 CONTENT */}
      <div className="relative z-30 bg-white lg:px-4 px-2 py-2 lg:py-4 rounded-b-xl">
        {/* Name */}
        <h3 className="font-bold text-sm lg:text-base text-gray-900 truncate">
          {mentor?.fullName}
        </h3>

        {/* Price */}
        <div className=" text-sm font-semibold text-green-700">
          ₹
          {+mentor?.teachingModes?.homeTuition?.monthlyPrice +
            +mentor?.teachingModes?.homeTuition?.margin || 0}
          <span className="text-xs text-gray-500"> / month</span>
        </div>

        {/* ACTION BUTTONS */}
        <div className="mt-2 flex items-center justify-between lg:gap-2 gap-1">
          {/* <Button
            onClick={handleChatClick}
            className="flex-1 bg-gradient-to-r from-homentor-chat to-homentor-chatHover hover:opacity-90 text-xs gap-1"
          >
            <MessageCircle className="w-4 h-4" />
            Chat
          </Button> */}

          <Button
            onClick={initiateDirectCall}
            className="flex-1 bg-gradient-to-r from-homentor-call to-homentor-callHover hover:opacity-90 text-xs gap-1"
          >
            <PhoneCall className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => setShowBookingOptions(true)}
            className=" w-full bg-green-600 hover:bg-green-700 text-xs flex gap-2"
          >
            <CalendarPlus className="w-4 h-4" />
            Book <span className="hidden lg:flex">Now</span>
          </Button>
        </div>

        {/* BOOK NOW */}
      </div>

      {/* 📦 BOOKING MODAL */}
      {showBookingOptions && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[300px]">
            <h2 className="text-lg font-bold mb-4">Choose Booking Type</h2>

            {mentor?.demoType === "free" && (
              <button
                onClick={() => {
                  setShowBookingOptions(false);
                  handlePayment(0);
                }}
                className="w-full mb-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Book Free Demo
              </button>
            )}

            {mentor?.demoType === "paid" && (
              <button
                onClick={() => {
                  setShowBookingOptions(false);
                  handlePayment(99);
                }}
                className="w-full mb-2 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
              >
                Book Demo @ ₹99
              </button>
            )}

            <button
              onClick={() => {
                setShowBookingOptions(false);
                handlePayment(
                  +mentor?.teachingModes?.homeTuition?.monthlyPrice +
                    +mentor?.teachingModes?.homeTuition?.margin
                );
              }}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Monthly Subscription
            </button>

            <button
              onClick={() => setShowBookingOptions(false)}
              className="w-full mt-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* LOGIN POPUP */}
      <LoginPopup
        isOpen={isLoginOpen}
        pendingAction={pendingAction}
        setPendingAction={setPendingAction}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
};

export default TornCard;
