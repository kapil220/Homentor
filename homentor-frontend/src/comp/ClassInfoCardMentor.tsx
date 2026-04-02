"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";

export default function ClassInfoCardMentor({ classBooking }) {
  const [mentorConfirmed, setMentorConfirmed] = useState(classBooking.mentorCompletion);
  const [parentConfirmed, setParentConfirmed] = useState(classBooking.parentCompletion);

  const handleMentorCheck = async (checked) => {
    try {
      const res = await axios.post(
        `https://homentor-backend.onrender.com/api/class-bookings/${classBooking._id}/mentor-complete`
      );

      // If success, update UI tick
      setMentorConfirmed(checked);
      console.log(res.data);

    } catch (err) {
      // API will return remaining classes message
      if (err.response?.data?.message) {
        alert(err.response.data.message);  // shows "X classes are remaining"
      } else {
        alert("Something went wrong!");
      }

      // Revert the checkbox state if failed
      setMentorConfirmed(false);
      console.log(err);
    }
  };

  return (
    <Card className="mt-3 w-full shadow-lg rounded-xl p-2">
      <CardHeader className="pb-1">
        <CardTitle className="flex justify-between items-center text-[16px] font-semibold">
          <span>Class Completed: </span>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={mentorConfirmed}
                onCheckedChange={(checked) => handleMentorCheck(!!checked)}
              />
              Mentor
            </label>

            <label className="flex items-center gap-2 opacity-50 cursor-not-allowed">
              <Checkbox disabled checked={parentConfirmed} />
              Parent
            </label>
          </div>
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
