import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import EditMentorForm from "@/comp/EditMentorForm";
import MentorSecondForm from "@/comp/MentorSecondForm";

const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-900 mt-0.5 break-words">{value || "—"}</p>
  </div>
);

const MentorProfileSettings = () => {
  const phone = localStorage.getItem("mentor");
  const [mentor, setMentor] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [isOn, setIsOn] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const load = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/mentor/login-check`,
        { phone }
      );
      setMentor(res.data.data);
      setIsOn(!!res.data.data?.showOnWebsite);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleVisibility = async (next: boolean) => {
    if (!mentor?._id) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/mentor/${mentor._id}`,
        { showOnWebsite: next }
      );
      setIsOn(next);
    } catch (e) {
      console.error(e);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      alert("Enter current and new password");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match");
      return;
    }
    if (newPassword.length < 6) {
      alert("New password must be at least 6 characters");
      return;
    }
    setPwLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/mentor/change-password`,
        { phone, oldPassword, newPassword }
      );
      alert("Password updated");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Failed to update password");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <DashboardLayout role="mentor" title="Profile" subtitle="Mentor details, visibility and security">
      <div className="space-y-6 max-w-3xl">
        {/* Personal info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-4 min-w-0">
              <img
                src={mentor?.profilePhoto || "/placeholder.svg"}
                alt="mentor"
                className="w-14 h-14 rounded-full border object-cover"
              />
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">{mentor?.fullName}</p>
                <p className="text-xs text-gray-500">{mentor?.phone}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => setEditOpen(true)}>
                Edit Form
              </Button>
              {mentor && (
                <MentorSecondForm mentorId={mentor._id} phone={mentor.phone} />
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email" value={mentor?.email} />
            <Field label="Gender" value={mentor?.gender} />
            <Field label="Experience" value={mentor?.experience} />
            <Field label="Rating" value={mentor?.rating} />
            <Field
              label="Subjects"
              value={Array.isArray(mentor?.subjects) ? mentor.subjects.join(", ") : ""}
            />
            <Field
              label="Monthly Price"
              value={
                mentor?.teachingModes?.homeTuition?.monthlyPrice
                  ? `₹${mentor.teachingModes.homeTuition.monthlyPrice}`
                  : ""
              }
            />
          </div>
        </div>

        {/* Visibility */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Website Visibility</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Toggle whether parents can find you in mentor search.
              </p>
            </div>
            <button
              onClick={() => toggleVisibility(!isOn)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 ${
                isOn ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                  isOn ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Change password */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Change Password</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="password"
              placeholder="Current password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div className="mt-3">
            <Button onClick={handleChangePassword} disabled={pwLoading}>
              {pwLoading ? "Updating…" : "Update Password"}
            </Button>
          </div>
        </div>
      </div>

      {editOpen && mentor && (
        <EditMentorForm
          mentorData={mentor}
          onClose={() => {
            setEditOpen(false);
            load();
          }}
          onSave={load}
        />
      )}
    </DashboardLayout>
  );
};

export default MentorProfileSettings;
