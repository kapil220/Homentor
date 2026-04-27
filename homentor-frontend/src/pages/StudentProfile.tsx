import { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import ParentProfileForm from "@/comp/ParentProfileForm";

const Field = ({ label, value }: { label: string; value?: string | number | null }) => (
  <div>
    <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
    <p className="text-sm font-medium text-gray-900 mt-0.5">{value || "—"}</p>
  </div>
);

const StudentProfile = () => {
  const phone = localStorage.getItem("usernumber");
  const [user, setUser] = useState<any>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);

  const load = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/login-check`,
        { phone }
      );
      setUser(res.data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
        `${import.meta.env.VITE_API_BASE_URL}/users/change-password`,
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
    <DashboardLayout role="student" title="Profile" subtitle="Personal details and security">
      <div className="space-y-6 max-w-3xl">
        {/* Personal info */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Personal Details</h2>
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              Edit
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Name" value={user?.parentName || user?.name} />
            <Field label="Phone" value={user?.phone} />
            <Field label="Email" value={user?.email} />
            <Field
              label="Address"
              value={
                user?.address
                  ? [
                      user.address.street,
                      user.address.city,
                      user.address.state,
                      user.address.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")
                  : ""
              }
            />
          </div>

          {user?.children?.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-gray-900 mb-2">Children</p>
              <div className="space-y-2">
                {user.children.map((c: any, i: number) => (
                  <div
                    key={i}
                    className="flex flex-wrap gap-x-4 gap-y-1 text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2"
                  >
                    <span>
                      <strong>{c.name || `Child ${i + 1}`}</strong>
                    </span>
                    {c.class && <span className="text-gray-600">Class: {c.class}</span>}
                    {c.school && <span className="text-gray-600">School: {c.school}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
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

      {user && (
        <ParentProfileForm
          open={editOpen}
          onClose={() => {
            setEditOpen(false);
            load();
          }}
          userId={user._id}
          initialData={user}
        />
      )}
    </DashboardLayout>
  );
};

export default StudentProfile;
