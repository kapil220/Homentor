import React, { useEffect, useState } from "react";
import { Badge } from "./ui/badge";
import { CalendarPlus, MessageCircle, PhoneCall, Star } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginPopup from "./LoginPopup";
import { createOrder } from "@/api/payment.jsx";
import { load } from "@cashfreepayments/cashfree-js";

const TornCard = ({ mentor }) => {
  const [showBookingOptions, setShowBookingOptions] = useState(false);
  const [pendingAction, setPendingAction] = useState({type: null});
  useEffect(() => {
    getAdminData();
  }, []);
  const navigate = useNavigate();

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const handleChatClick = () => {
    localStorage.setItem("mentorNumber", mentor.phone);
    localStorage.setItem("mentor", JSON.stringify(mentor));
    const parentPhone = "8878084604";
    if (!parentPhone) return alert("Login required");

    navigate(`/chat/${mentor.fullName}`);
  };

  const handleSelectMentor = () => {
    localStorage.setItem("mentor", JSON.stringify(mentor));
    navigate(`/mentors/${mentor.fullName}`);
  };

  const userNumber = localStorage.getItem("usernumber");
  const [bookingAmount, setBookingAmount] = useState(0)

  const handlePayment = async (fees) => {

    if (!userNumber) {
      setPendingAction({ type: "payment", amount: fees });
      setBookingAmount(fees)
      setIsLoginOpen(true);
      return;
    }

    if (fees === 0) {
      // Free demo → hit your demo booking API directly
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/demo-booking`, {
          mentorId: mentor._id,
          parentPhone: userNumber,
          studentName: "Demo Student", // you can collect name in popup if needed
          address: "Not Provided",
          fee: 0,
          mentorPhone : mentor.phone
        });
        alert("Free Demo Booked Successfully ✅");
        navigate('/dashboard/student');

      } catch (error) {
        alert("Failed to book demo");
      }
      return;
    }

    // Paid demo or monthly subscription → use gateway
    try {
      const data = await createOrder({
        amount: fees,
        customerId: `homentor${Date.now()}`,
        customerPhone: userNumber,
        mentorId: mentor._id,
      });

      localStorage.setItem("orderId", data.order_id);

      let cashfree = await load({ mode: "production" });

      let checkoutOptions = {
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",
      };
      await cashfree.checkout(checkoutOptions);
    } catch (error) {
      alert("Failed to initiate payment");
    }
  };

  useEffect(() => {
    if (userNumber && pendingAction.type === "PAYMENT") {
      handlePayment(bookingAmount)
    } else if (userNumber && pendingAction.type === "CALL") {
      initiateExotelCall()
    }
  }, [pendingAction])

  const sendCallRequest = () => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/mentor-call`, {
        name: mentor.fullName,
        phone: mentor.phone,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  const [callingNo, setCallingNo] = useState("");
  const getAdminData = () => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/admin`).then((res) => {
      if (mentor?.callRouting?.mode === "mentor") {
        setCallingNo(mentor?.phone);
      } else {
        setCallingNo(res.data.data[0].callingNo);
      }
    });
  };

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
    axios.post(
      `${import.meta.env.VITE_API_URL}/api/exotel/call/initiate`,
      {
        parentPhone: `0${userNumber}`, mentorId: mentor._id, mentorPhone: mentor.phone
      }
    ).then((res) => window.location.href = "tel:07314852387").catch((err) => console.log(err))
  };

  return (
    <div className="relative animate-shake origin-top w-[100%] flex overflow-hidden flex-col items-center bg-[papayawhip] rounded-lg  shadow-[0_0_20px_-5px_black]">
      {/* 📌 Pin (just like CSS :after) */}

      <div
        className="absolute z-30"
        style={{
          top: "0.5rem",
          left: "50%",
          transform: "translate(-50%, 0)",
          width: "0.7rem",
          height: "0.7rem",
          backgroundColor: "crimson",
          borderRadius: "50%",
          boxShadow: "-0.1rem -0.1rem 0.3rem 0.02rem rgba(0, 0, 0, 0.5) inset",
          filter: "drop-shadow(0.3rem 0.15rem 0.2rem rgba(0, 0, 0, 0.5))",
        }}
      />
      {/* Star */}
      <div className="absolute top-2 right-2 z-[30]">
        <Badge className="bg-white/90 backdrop-blur-sm text-black text-[10px] font-semibold px-2 py-1 flex items-center gap-1 shadow-lg transform-gpu transition-transform duration-300 hover:scale-110">
          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
          {mentor?.rating}
        </Badge>
      </div>

      <div className="w-[100%] lg:block hidden h-[20vh] bg-black absolute z-[100] opacity-30 mentor-bg"></div>

      <div className="lg:text-lg text-white text-sm lg:block hidden font-bold mentor-content absolute z-[40] bottom-[16vh]">
        {mentor.fullName}
      </div>

      <div className="lg:text-lg text-sm text-white lg:hidden font-bold mentor-content absolute z-[40] bottom-[8vh]">
        {mentor.fullName}
      </div>
      <div className="absolute z-[1000] lg:flex hidden gap-10 bottom-[10vh]">
        <Button
          onClick={() => handleChatClick()}
          className="bg-gradient-to-r mentor-icons1  from-homentor-chat to-homentor-chatHover hover:from-homentor-chatHover hover:to-homentor-chat transition-all duration-300 flex items-center justify-center gap-1 group/icon overflow-hidden relative"
          title="Chat with mentor"
        >
          <MessageCircle className="lg:w-4 lg:h-4 h-2 w-2 transition-transform duration-300 group-hover/icon:scale-110" />
          <span className="inline lg:text-md text-[10px]">Chat</span>
          <span className=" absolute inset-0 bg-white/10 transform-gpu -translate-x-full group-hover/icon:translate-x-0 transition-transform duration-500"></span>
        </Button>

        <Button
          className="bg-gradient-to-r mentor-icons2 from-homentor-call to-homentor-callHover hover:from-homentor-callHover hover:to-homentor-call transition-all duration-300 flex items-center justify-center gap-1 group/icon overflow-hidden relative"
          title="Call mentor"
        >
          <PhoneCall className="lg:w-4 lg:h-4 h-2 w-2 transition-transform duration-300 group-hover/icon:scale-110" />
          <a
            onClick={() => { sendCallRequest() }}
            href={`tel:${callingNo}`}
            className="inline lg:text-md text-[10px]"
          >
            Call
          </a>
        </Button>
      </div>

      {/* Login Popup */}
      <LoginPopup isOpen={isLoginOpen} setPendingAction={setPendingAction} pendingAction={pendingAction} onClose={() => setIsLoginOpen(false)} />

      <div className="absolute z-[30] lg:hidden flex justify-between w-full items-center  gap-1 bottom-[1vh] px-2">
        <button
          onClick={() => handleChatClick()}
          className="border bg-blue-opacity px-1 py-0.5 border-mentor-blue-500 rounded-[2px] bg-mentor-blue-500 text-white mentor-icons1-sm from-homentor-chat to-homentor-chatHover hover:from-homentor-chatHover hover:to-homentor-chat transition-all duration-300 flex items-center justify-center overflow-hidden "
          title="Chat with mentor"
        >
          <span className="inline lg:text-md text-[11px]">Chat</span>
        </button>
        <button
          onClick={() =>
            setShowBookingOptions(true)
          }
          className="bg-green-500 z-[100] bg-opacity px-1 py-0 gap-0 rounded-[2px] flex lg:hidden flex-col h-[auto]"
        >
          <span className="text-[10px] sm:inline text-white">Book Now</span>
          <div className="lg:text-[12px] text-[11px]  text-white flex items-center">
            ({(+mentor?.teachingModes?.homeTuition?.monthlyPrice + +mentor?.teachingModes?.homeTuition?.margin) / 1000}k
            <span className="text-[9px] ">/month</span>)
          </div>
        </button>
        <button
          onClick={() => initiateExotelCall()}
          className="border bg-blue-opacity px-1 py-0.5 border-mentor-blue-500 rounded-[2px] bg-mentor-blue-500 text-white mentor-icons1-sm from-homentor-chat to-homentor-chatHover hover:from-homentor-chatHover hover:to-homentor-chat transition-all duration-300 flex items-center justify-center overflow-hidden "
          title="Chat with mentor"
        >
          <a
            className="inline lg:text-md text-[11px]"
          >
            Call
          </a>
        </button>
      </div>

      <Button
        onClick={() =>
          setShowBookingOptions(true)
        }
        className="absolute z-[100] bg-green-500 gap-0 lg:flex hidden flex-col bottom-[1vh] h-[auto]"
      >
        <div className="flex gap-2">
          <CalendarPlus className="lg:w-4 lg:h-4 h-3 w-3 hidden lg:inline transition-transform duration-300 group-hover/icon:scale-110" />
          <span className="text-[10px] sm:inline">Book Now</span>
        </div>
        <div className="lg:text-[12px] text-[9px] mentor-content-2 text-white">
          ({(+mentor?.teachingModes?.homeTuition?.monthlyPrice + +mentor?.teachingModes?.homeTuition?.margin) / 1000}k/month)
        </div>
      </Button>

      {showBookingOptions && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-[300px]">
            <h2 className="text-lg font-bold mb-4">Choose Booking Type</h2>

            {/* Show Free Demo if demoType is "free" */}
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

            {/* Show Paid Demo if demoType is "paid" */}
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

            {/* Always show monthly subscription */}
            <button
              onClick={() => {
                setShowBookingOptions(false);
                handlePayment(+mentor?.teachingModes?.homeTuition?.monthlyPrice + +mentor?.teachingModes?.homeTuition?.margin);
              }}
              className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Monthly Subscription (₹{mentor?.teachingModes?.homeTuition?.monthlyPrice + +mentor?.teachingModes?.homeTuition?.margin})
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


      {/* 🖼 Foreground content (not distorted) */}
      <div className="relative z-20 w-full lg:h-[60vh] h-[28vh]">
        <img
          src={mentor.profilePhoto ? mentor.profilePhoto : ""}
          alt="mentor"
          className="w-[98%] relative left-[01%] top-[1%] rounded-lg h-full object-cover"
          onClick={() => handleSelectMentor()}
        />

        <div className="Card-wave wave-first"></div>
      </div>
    </div>
  );
};

export default TornCard;
