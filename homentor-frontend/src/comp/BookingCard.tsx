import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle, Wallet, Banknote } from "lucide-react";

type BookingCardProps = {
  mentorData: any;
  payNow: (price: number, duration: number) => void;
  payCash?: (price: number, duration: number) => void;
  payManual?: (price: number, duration: number) => void;
  onlinePaymentMode?: "gateway" | "manual";
};

const BookingCard = ({ mentorData, payNow, payCash, payManual, onlinePaymentMode = "gateway" }: BookingCardProps) => {
  const [mode, setMode] = useState("monthly");
  const [hours, setHours] = useState(1);

  const monthlyRate = parseInt(
    mentorData.teachingModes.homeTuition.monthlyPrice +
      mentorData?.teachingModes?.homeTuition?.margin || "0",
    10
  );

  // 🔥 Demo price based on admin setting
  const demoRate = mentorData.demoType === "free" ? "Free" : 99;

  const getPrice = () => {
    if (mode === "demo") return demoRate;

    if (mode === "hourly")
      return (
        Math.round((mentorData.teachingModes.homeTuition.monthlyPrice +
          mentorData?.teachingModes?.homeTuition?.margin) /
        22 *
        hours)
      );

    return monthlyRate;
  };
  const duration = mode === "demo" ? 2 : mode === "hourly" ? hours : 22;
  return (
    <div className="flex flex-col gap-4 lg:px-4 px-2 py-3 rounded-2xl bg-white border border-gray-200 lg:min-w-[250px] w-full">
      <div className="flex justify-between">
        
        {/* Price Section */}
        <div className="text-right w-[45%]">
          <p className="text-4xl font-bold text-yellow-600 tracking-wide text-nowrap">
             {getPrice() == "Free" ? "" : "₹"}  {getPrice()?.toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">
            {mode === "monthly" && "per month"}
            {mode === "demo" && (demoRate === 0 ? "Free Demo" : "demo class")}
            {mode === "hourly" &&
              `${hours} hour${hours > 1 ? "s" : ""}`}
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex w-[45%] flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">
            Select Plan:
          </label>

          <select
            className="border rounded px-3 py-2 text-sm"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="monthly">Monthly</option>

            <option value="demo">
              {mentorData.demoType === "free" ? "Free Demo" : "Demo Class (₹99)"}
            </option>

            <option value="hourly">Choose No. of Hours</option>
          </select>

          {mode === "hourly" && (
            <input
              type="number"
              min={1}
              value={hours}
              onChange={(e) => setHours(Number(e.target.value))}
              className="mt-2 border rounded px-3 py-2 text-sm"
              placeholder="Enter hours"
            />
          )}
        </div>
      </div>

      {/* Book Now — gateway mode uses payNow; manual mode shows UPI/bank details flow */}
      {onlinePaymentMode === "manual" && payManual ? (
        <Button
          onClick={() => payManual(getPrice() as number, duration)}
          size="lg"
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-md font-semibold shadow-md"
        >
          <Banknote className="h-4 w-4 mr-2" />
          Book Now (UPI / Bank Transfer)
        </Button>
      ) : (
        <Button
          onClick={() => payNow(getPrice() as number, duration)}
          size="lg"
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-md font-semibold shadow-md"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Book Now (Online)
        </Button>
      )}

      {payCash && getPrice() !== "Free" && (
        <Button
          onClick={() => payCash(getPrice() as number, duration)}
          size="lg"
          variant="outline"
          className="w-full border-green-500 text-green-700 hover:bg-green-50 font-semibold"
        >
          <Wallet className="h-4 w-4 mr-2" />
          Book with Cash (Admin approval)
        </Button>
      )}

      {/* Contact Buttons */}
      <div className="lg:flex hidden justify-between gap-2 mt-1">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          Send Message
        </Button>

        <a href={`tel:${mentorData.phone}`} className="w-full">
          <Button
            variant="outline"
            size="sm"
            className="w-full border-green-500 text-green-600 hover:bg-green-50"
          >
            <MessageCircle className="h-4 w-4 mr-1" />
            Call
          </Button>
        </a>
      </div>
    </div>
  );
};

export default BookingCard;
