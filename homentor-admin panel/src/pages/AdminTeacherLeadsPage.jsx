import axios from "axios";
import { useEffect, useState } from "react";
import AdminLayout from "../comp/AdminLayout";

export default function AdminTeacherLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/teacher-leads/admin/pending`
      );
      setLeads(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch teacher leads", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const approve = async (id) => {
    if (!window.confirm("Approve this commission payment and unlock the lead?")) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/teacher-leads/admin/${id}/approve`
      );
      fetchLeads();
    } catch (err) {
      alert("Failed to approve");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Teacher Lead Payments</h2>
        {loading && <p className="text-gray-500">Loading...</p>}
        {!loading && leads.length === 0 && (
          <p className="text-gray-500">No pending commission payments.</p>
        )}
        {leads.map((lead) => (
          <div key={lead._id} className="bg-white rounded-xl shadow p-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-gray-800">
                  Teacher: {lead.mentorId?.fullName || "—"} ({lead.mentorId?.category})
                </p>
                <p className="text-sm text-gray-600">Parent: {lead.parentName || "Anonymous"} · {lead.parentPhone}</p>
                <p className="text-sm text-gray-600">Class: {lead.parentClass || "—"} · Subjects: {lead.parentSubjects || "—"}</p>
                <p className="text-sm text-gray-600">Amount: ₹{lead.commissionAmount}</p>
                {lead.paymentRef && (
                  <a
                    href={lead.paymentRef}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 underline"
                  >
                    View Screenshot
                  </a>
                )}
              </div>
              <button
                onClick={() => approve(lead._id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
              >
                Approve
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
