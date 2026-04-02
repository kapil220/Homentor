import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import axios from "axios";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

const getFirstName = (fullName = "") => fullName.split(" ")[0];

export default function HistoryAttendanceModal({ classBooking }) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    axios
      .get(
        `https://homentor-backend.onrender.com/api/class-records/class-booking/${classBooking._id}`
      )
      .then((res) => setRecords(res.data.data));
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          👁 View Attendance
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>📄 Attendance History</DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            This class was reassigned to another mentor. Attendance is read-only.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-md">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr className="text-left">
                <th className="px-3 py-2">Date</th>
                <th className="px-3 py-2">Duration</th>
                <th className="px-3 py-2">Mentor</th>
                <th className="px-3 py-2 text-center">Mentor Present</th>
                <th className="px-3 py-2 text-center">Parent Confirmed</th>
              </tr>
            </thead>

            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center text-gray-500 py-6"
                  >
                    No attendance records found
                  </td>
                </tr>
              ) : (
                records.map((rec) => (
                  <tr
                    key={rec._id}
                    className="border-t hover:bg-gray-50"
                  >
                    <td className="px-3 py-2">
                      {new Date(rec.date).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-3 py-2">
                      {rec.duration} min
                    </td>

                    <td className="px-3 py-2 font-medium text-gray-700">
                      {getFirstName(rec?.mentor?.fullName || "")}
                    </td>

                    <td className="px-3 py-2 text-center">
                      <Checkbox checked={rec.mentorTick} disabled />
                    </td>

                    <td className="px-3 py-2 text-center">
                      <Checkbox checked={rec.parentTick} disabled />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}
