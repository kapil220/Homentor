import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useState, useEffect } from "react";
import axios from "axios";
import ClassInfoCardParent from "./ClassInfoCardParent";
const getFirstName = (fullName = "") => fullName.split(" ")[0];

export default function ParentAttendanceModal({ classBooking, modalType, fetchBookings  }: any) {

  useEffect(() => {
    getClassRecords();
  }, []);

  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const getClassRecords = async () => {
    setLoading(true)
    const response = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/class-records/class-booking/${classBooking._id}`
    );
    setRecords(response.data.data);
    setLoading(false)
  };

  const updateParentAtt = async (record) => {
    const response = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/class-records/${record._id}`,
      {
        parentTick: true,
      }
    );
    getClassRecords();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          📝{modalType}
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-h-[80vh] overflow-y-auto px-1">
        <DialogHeader>
          <DialogTitle>📄 Attendance Sheet</DialogTitle>
        </DialogHeader>

        {loading ? (
          <p className="text-center text-gray-500">Loading records...</p>
        ) : (
          <div className="overflow-x-auto w-full border rounded-lg overflow-y-auto">
            <table className="w-full text-sm text-left ">
              <thead className=" bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-3 py-2">Date & Time</th>

                  <th className="px-3 py-2">Duration</th>
                  <th className="px-3 py-2">Mentor</th>
                  <th className="px-3 py-2">Parent</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec._id} className="border-b">
                    <td className="px-3 py-2 text-nowrap flex flex-col">
                      <div>
                        {new Date(rec.date).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="text-xs text-gray-500">
                        {rec?.timeIn} - {rec?.timeOut}
                      </div>
                    </td>

                    <td className="px-3 py-2">{rec?.duration}</td>

                    <td className="px-3 py-2 text-center flex flex-col items-center">
                      <Checkbox checked={rec.mentorTick} />
                      <label className="text-[10px] text-gray-700">{getFirstName(rec?.mentor?.fullName || "")}</label>

                    </td>

                    <td className="px-3 py-2 text-center">
                      <Checkbox
                        checked={rec.parentTick}
                        onClick={() => updateParentAtt(rec)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <ClassInfoCardParent classBooking={classBooking} />
      </DialogContent>
    </Dialog>
  );
}
