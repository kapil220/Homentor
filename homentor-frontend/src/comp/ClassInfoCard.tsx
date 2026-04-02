import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";

export default function ClassInfoCard() {
  const [mentorConfirmed, setMentorConfirmed] = useState(false);
  const [parentConfirmed, setParentConfirmed] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");

  const handleMentorCheck = (checked) => {
    setMentorConfirmed(checked);
    if (checked) setParentConfirmed(false); // uncheck parent automatically
  };

  const handleParentCheck = (checked) => {
    setParentConfirmed(checked);
    if (checked) setMentorConfirmed(false); // uncheck mentor automatically
  };

  return (
    <Card className="mt-3 w-full shadow-lg rounded-xl p-2">
      {/* Header */}
      <CardHeader className="pb-1">
        <CardTitle className="flex flex-row justify-between items-center text-[16px] font-semibold">
          <span>Class Completed:</span>

          <div className="flex gap-4 mt-2 sm:mt-0">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={mentorConfirmed}
                onCheckedChange={(checked) => handleMentorCheck(!!checked)}
              />
              Mentor
            </label>

            <label className="flex items-center gap-2">
              <Checkbox
                checked={parentConfirmed}
                onCheckedChange={(checked) => handleParentCheck(!!checked)}
              />
              Parent
            </label>
          </div>
        </CardTitle>
      </CardHeader>

      {/* Body */}
      <CardContent className="space-y-3">

        <div>
          <p className="font-medium mb-1">Rating:</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                onClick={() => setRating(star)}
                className={`w-6 h-6 cursor-pointer ${
                  star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
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
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            Book Next Session
          </Button>
          <Button variant="destructive">
            Terminate / Change Teacher
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
