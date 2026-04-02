import { useEffect, useState } from "react";
import axios from "axios";
import AdminLeadForm from "../comp/AdminLeadForm";
import { AdminLeadsTable } from "../comp/AdminLeadsTable";
import AdminLayout from "../comp/AdminLayout";
import ParentLeadForm from "../comp/ParentLeadForm";
import { ParentLeadsTable } from "../comp/ParentLeadsTable";

export default function AdminParentLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchLeads = async () => {
    const { data } = await axios.get(
      "https://homentor-backend.onrender.com/api/parent-leads"
    );
    setLeads(data);
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* HEADER + ACTION */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Parent Leads
            </h2>
            <p className="text-sm text-gray-500">
              Manage parent onboarding and follow-ups
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 transition"
          >
            + Add Parent Lead
          </button>
        </div>

        {/* FORM MODAL */}
        {showForm && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
            <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg relative overflow-y-auto max-h-[90vh]">
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">
                  Add Parent Lead
                </h3>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-500 hover:text-black text-xl"
                >
                  ✕
                </button>
              </div>

              {/* FORM */}
              <div className="p-6">
                <ParentLeadForm
                  refresh={() => {
                    fetchLeads();
                    setShowForm(false);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* TABLE */}
        <ParentLeadsTable leads={leads} refresh={fetchLeads} setLeads={setLeads}/>
      </div>
    </AdminLayout>
  );
}
