import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle, PhoneCall } from "lucide-react";
import { callMentor } from "@/lib/callMentor";

type BookingCardProps = {
  mentorData: any;
  onBook: (price: number, duration: number) => void;
};

const BookingCard = ({ mentorData, onBook }: BookingCardProps) => {
  const [mode, setMode] = useState("monthly");
  const [hours, setHours] = useState(1);

  const monthlyRate = parseInt(
    mentorData.teachingModes.homeTuition.monthlyPrice +
      mentorData?.teachingModes?.homeTuition?.margin || "0",
    10
  );

  const demoRate = mentorData.demoType === "free" ? "Free" : 99;

  const getPrice = () => {
    if (mode === "demo") return demoRate;
    if (mode === "hourly")
      return Math.round(
        ((mentorData.teachingModes.homeTuition.monthlyPrice +
          mentorData?.teachingModes?.homeTuition?.margin) /
          22) *
          hours
      );
    return monthlyRate;
  };
  const duration = mode === "demo" ? 2 : mode === "hourly" ? hours : 22;
  const price = getPrice();
  const isFree = price === "Free";

  const handleBookNow = () => {
    onBook(isFree ? 0 : (price as number), duration);
  };

  return (
    <div className="flex flex-col gap-4 lg:px-4 px-2 py-3 rounded-2xl bg-white border border-gray-200 lg:min-w-[250px] w-full">
      <div className="flex justify-between">
        <div className="text-right w-[45%]">
          <p className="text-4xl font-bold text-yellow-600 tracking-wide text-nowrap">
            {isFree ? "" : "₹"} {price?.toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">
            {mode === "monthly" && "per month"}
            {mode === "demo" && (demoRate === 0 ? "Free Demo" : "demo class")}
            {mode === "hourly" && `${hours} hour${hours > 1 ? "s" : ""}`}
          </p>
        </div>

        <div className="flex w-[45%] flex-col gap-2">
          <label className="text-sm font-medium text-gray-600">Select Plan:</label>
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

      <Button
        onClick={handleBookNow}
        size="lg"
        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-md font-semibold shadow-md"
      >
        <Calendar className="h-4 w-4 mr-2" />
        Book Now
      </Button>

      <div className="lg:flex hidden justify-between gap-2 mt-1">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-blue-500 text-blue-600 hover:bg-blue-50"
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          Send Message
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => callMentor(mentorData)}
          className="w-full border-green-500 text-green-600 hover:bg-green-50"
        >
          <PhoneCall className="h-4 w-4 mr-1" />
          Call
        </Button>
      </div>
    </div>
  );
};

export default BookingCard;
