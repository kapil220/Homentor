import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Phone, UserRound, ArrowUpRight } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ChangeTeacherModal = ({
  open,
  onClose,
  booking,
  backupTeachers = [],
  onChangeTeacher,
}) => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  useEffect(() => {
    const fetchBackupTeachers = async () => {
      try {
        // Get teacher history IDs if they exist
        const teacherHistoryIds =
          booking?.teacherHistory?.map((entry) => entry.teacherId) || [];

        // Combine backup teachers and teacher history IDs, remove duplicates
        const allTeacherIds = [
          ...new Set([...backupTeachers, ...teacherHistoryIds]),
        ];

        if (allTeacherIds.length === 0) {
          setTeachers([]);
          return;
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/mentor/batch`,
          { ids: allTeacherIds }
        );

        setTeachers(response.data.mentors);
      } catch (error) {
        console.error("Failed to fetch teachers", error);
      }
    };

    if (open) {
      fetchBackupTeachers();
    }
  }, [backupTeachers, booking?.teacherHistory, open]);

  const handleConfirm = () => {
    if (!selectedTeacher) {
      return alert("Please select a teacher");
    }
    axios
      .post(
        `${import.meta.env.VITE_API_URL}/api/class-bookings/${booking._id}/change-teacher`,
        {
          newTeacherId: selectedTeacher._id,
          newTeacherPrice:
            selectedTeacher.teachingModes?.homeTuition?.monthlyPrice,
        }
      )
      .then((res) => {
        console.log(res.data);
        window.location.reload();
      });
  };

  const userNumber = localStorage.getItem("usernumber");
  const initiateExotelCall = () => {
      axios
        .post(`${import.meta.env.VITE_API_URL}/api/exotel/call/initiate`, {
          parentPhone: `0${userNumber}`,
          mentorId: selectedTeacher._id,
          mentorPhone: selectedTeacher.phone,
        })
        .then((res) => (window.location.href = "tel:07314852387"))
        .catch((err) => console.log(err));
    };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Change Teacher
          </DialogTitle>
          <DialogDescription>
            Select from the available backup teachers below.
          </DialogDescription>
        </DialogHeader>

        {/* Backup Teacher List */}
        <ScrollArea className="max-h-96 rounded-md border p-3">
          {teachers.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              No backup teachers found.
            </p>
          ) : (
            <div className="space-y-4">
              {teachers.map((teacher) => {
                const price =
                  teacher?.teachingModes?.homeTuition?.finalPrice || "N/A";

                return (
                  <div
                    key={teacher._id}
                    className={`p-4 rounded-xl border transition cursor-pointer ${
                      selectedTeacher?._id === teacher._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setSelectedTeacher(teacher)}
                  >
                    <div className="flex gap-4 items-center">
                      {/* Profile Photo */}
                      <img
                        src={teacher.profilePhoto}
                        alt={teacher.fullName}
                        className="w-16 h-16 rounded-full object-cover border"
                      />

                      {/* Info */}
                      <div className="flex-1">
                        <p className="font-semibold text-lg text-gray-800 flex items-center gap-1">
                          <UserRound size={18} />
                          {teacher.fullName}
                        </p>

                        <p className="text-sm text-gray-600">
                          {teacher.subjects?.join(", ") || "Subjects not added"}
                        </p>

                        <p className="text-sm text-green-600 font-semibold mt-1">
                          Fee: ₹ {price}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-2">
                        {/* Call Button */}
                        <a
                          onClick={()=>initiateExotelCall()}
                          className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-2"
                        >
                          <Phone size={16} />
                          Call
                        </a>

                        {/* View Profile */}
                        <label
                          onClick={() => {
                            localStorage.setItem(
                              "mentor",
                              JSON.stringify(teacher)
                            );
                            localStorage.setItem("booking_id", booking._id);
                            navigate("/back-up-teacher-profile");
                          }}
                          className="px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm flex items-center gap-1"
                        >
                          View Profile
                          <ArrowUpRight size={14} />
                        </label>
                      </div>

                      {/* Select Button */}
                      <Button
                        variant={
                          selectedTeacher?._id === teacher._id
                            ? "default"
                            : "outline"
                        }
                      >
                        {selectedTeacher?._id === teacher._id
                          ? "Selected"
                          : "Select"}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={handleConfirm} disabled={!selectedTeacher}>
            Confirm Change
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeTeacherModal;
