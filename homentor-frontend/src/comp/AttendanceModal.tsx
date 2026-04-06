"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";
import ClassInfoCardMentor from "./ClassInfoCardMentor";
const getFirstName = (fullName = "") => fullName.split(" ")[0];

export default function AttendanceModal({ classBooking }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(null); // track saving row

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/class-records/class-booking/${classBooking._id}`
      );
      setRecords(res.data.data || []);
    } catch (err) {
      console.error("Error fetching records:", err);
    }
    setLoading(false);
  };
  // Fetch all attendance records
  useEffect(() => {
    fetchRecords();
  }, [classBooking._id]);

  // Handle inline change
  const handleChange = (id, field, value) => {
    setRecords((prev) =>
      prev.map((rec) => (rec._id === id ? { ...rec, [field]: value } : rec))
    );
  };

  // Save changes for a row
  const handleSave = async (record) => {
    setSaving(record._id);
    try {
      await axios
        .post(
          `${import.meta.env.VITE_API_URL}/api/class-records`,
          todayAtt
        )
        .then((res) => {
          fetchRecords();
          setTodayAtt({
            date: "",
            timeIn: "",
            timeOut: "",
            duration: "",
            topic: "",
            mentorTick: false,
            parentTick: false,
            classBooking: classBooking._id,
            mentor: classBooking.mentor,
            parent: classBooking.parent._id,
          });
          setSaving(null)
        });
    } catch (err) {
      console.error("Error saving:", err);
    }
    // setSaving(null);
  };

  const [todayAtt, setTodayAtt] = useState({
    date: "",
    timeIn: "",
    timeOut: "",
    duration: "",
    topic: "",
    mentorTick: false,
    parentTick: false,
    classBooking: classBooking._id,
    mentor: classBooking.mentor,
    parent: classBooking.parent._id,
  });
  console.log(todayAtt);
  const splitDuration = (duration) => {
    if (!duration) return { hr: "", min: "" };
    const [h, m] = duration.split(":");
    return { hr: h || "", min: m || "" };
  };

  const handleUpdate = async (rec) => {
    setSaving(rec._id);
    await axios.put(
      `${import.meta.env.VITE_API_URL}/api/class-records/${rec._id}`,
      rec
    );
    fetchRecords();
    setSaving(null);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          📝 Mark Attendance
        </Button>
      </DialogTrigger>

      <DialogContent className="w-full max-h-[80vh] overflow-y-auto px-1">
        <DialogHeader>
          <DialogTitle>📄 Attendance Sheet</DialogTitle>
          <DialogDescription>
            Update attendance for <strong>{classBooking.studentName}</strong>
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <p className="text-center text-gray-500">Loading records...</p>
        ) : (
          <div className="overflow-x-auto w-full border rounded-lg overflow-y-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2">Date</th>
                  <th className="px-3 py-2">Time In</th>
                  <th className="px-3 py-2">Time Out</th>
                  <th className="px-3 py-2">Duration</th>
                  <th className="px-3 py-2">Mentor</th>
                  <th className="px-3 py-2">Parent</th>
                  <th className="px-3 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {records.map((rec) => (
                  <tr key={rec._id} className="border-b">
                    <td className="px-3 py-2 flex flex-col">
                      <label>
                      {new Date(rec.date).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                      </label>
                      <label className="text-[10px] text-gray-700">{getFirstName(rec?.mentor?.fullName || "")}</label>
                    </td>

                    <td className="px-3 py-2">
                      <Input
                        type="time"
                        value={rec.timeIn || ""}
                        onChange={(e) =>
                          handleChange(rec._id, "timeIn", e.target.value)
                        }
                      />
                    </td>

                    <td className="px-3 py-2">
                      <Input
                        type="time"
                        value={rec.timeOut || ""}
                        onChange={(e) =>
                          handleChange(rec._id, "timeOut", e.target.value)
                        }
                      />
                    </td>

                    <td className="px-3 py-2">
                      <Input
                        value={rec.duration || ""}
                        onChange={(e) =>
                          handleChange(rec._id, "duration", e.target.value)
                        }
                      />
                    </td>

                    <td className="px-3 py-2 text-center">
                      <Checkbox
                        checked={rec.mentorTick}
                        onCheckedChange={(val) =>
                          handleChange(rec._id, "mentorTick", val)
                        }
                      />
                    </td>

                    <td className="px-3 py-2 text-center">
                      <Checkbox
                        disabled
                        checked={rec.parentTick}
                        onCheckedChange={(val) =>
                          handleChange(rec._id, "parentTick", val)
                        }
                      />
                    </td>

                    <td className="px-3 py-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(rec)}
                        disabled={saving === rec._id}
                      >
                        {saving === rec._id ? "Updating..." : "Update"}
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr className="border-b">
                  <td className="px-3 py-2">
                    <input
                      onChange={(e) =>
                        setTodayAtt({ ...todayAtt, date: e.target.value })
                      }
                      type="date"
                    ></input>
                  </td>

                  <td className="px-3 py-2">
                    <Input
                      type="time"
                      value={todayAtt.timeIn || ""}
                      onChange={(e) =>
                        setTodayAtt({ ...todayAtt, timeIn: e.target.value })
                      }
                    />
                  </td>

                  <td className="px-3 py-2">
                    <Input
                      type="time"
                      value={todayAtt.timeOut || ""}
                      onChange={(e) =>
                        setTodayAtt({ ...todayAtt, timeOut: e.target.value })
                      }
                    />
                  </td>

                  {/* Duration HR */}
                  <td className="px-3 py-2 flex gap-2 items-center">
                    {/* HR */}
                    <Input
                      placeholder="Hr"
                      type="number"
                      min="0"
                      value={splitDuration(todayAtt.duration).hr}
                      onChange={(e) => {
                        const hr = e.target.value;
                        const min = splitDuration(todayAtt.duration).min;
                        setTodayAtt({ ...todayAtt, duration: `${hr}:${min}` });
                      }}
                      className="w-16"
                    />
                      :
                    {/* MIN */}
                    <Input
                      placeholder="Min"
                      type="number"
                      min="0"
                      max="59"
                      value={splitDuration(todayAtt.duration).min}
                      onChange={(e) => {
                        const min = e.target.value;
                        const hr = splitDuration(todayAtt.duration).hr;
                        setTodayAtt({ ...todayAtt, duration: `${hr}:${min}` });
                      }}
                      className="w-16"
                    />
                  </td>


                  <td className="px-3 py-2 text-center">
                    <Checkbox
                      onClick={() =>
                        setTodayAtt({
                          ...todayAtt,
                          mentorTick: !todayAtt.mentorTick,
                        })
                      }
                    />
                  </td>

                  <td className="px-3 py-2 text-center">
                    <Checkbox disabled />
                  </td>

                  <td className="px-3 py-2">
                    <Button
                      size="sm"
                      onClick={() => handleSave(todayAtt)}
                      disabled={saving === todayAtt._id}
                    >

                      {saving === todayAtt._id ? "Saving..." : "Save"}
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <ClassInfoCardMentor classBooking={classBooking} />
      </DialogContent>
    </Dialog>
  );
}
