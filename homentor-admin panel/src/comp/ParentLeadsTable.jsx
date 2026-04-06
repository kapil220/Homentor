import { useState } from "react";
import ParentToogle from "./ParentToogle";
import { Pencil } from "lucide-react";
import ParentLeadForm from "./ParentLeadForm";
import axios from "axios";

export function ParentLeadsTable({ leads, refresh, setLeads }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [interviewStatus, setInterviewStatus] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const filteredLeads = leads
    ?.filter((lead) => {
      const text = `${lead.fullName} ${lead.phone} ${
        lead.location?.area || ""
      }`.toLowerCase();

      return (
        text.includes(search.toLowerCase()) &&
        (!category || lead.category === category) &&
        (!whatsapp || String(lead.whatsappAdded) === whatsapp) &&
        (!formStatus || String(lead.leadFormFilled) === formStatus) &&
        (!interviewStatus || String(lead.interviewDone) === interviewStatus)
      );
    })
    ?.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.fullName.localeCompare(b.fullName);
        case "name-desc":
          return b.fullName.localeCompare(a.fullName);
        case "fees-low":
          return (a.fees || 0) - (b.fees || 0);
        case "fees-high":
          return (b.fees || 0) - (a.fees || 0);
        case "experience":
          return (b.teachingExperience || 0) - (a.teachingExperience || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  const [selectedLead, setSelectedLead] = useState(null);

  const handleEdit = (lead) => {
    setSelectedLead(lead);
  };

  const [editingId, setEditingId] = useState(null);
  const [note, setNote] = useState("");

  const saveNote = () => {
    axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/parent-leads/${editingId}`,
      { lastActive: new Date(), lastActivityText: note }
    ).then((res)=>{
      refresh();
      setEditingId(null);
    });
  };

  return (
    <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b flex flex-wrap gap-3">
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search name / phone / location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm w-64"
        />

        {/* CATEGORY */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="">All Categories</option>
          <option value="Premium">Premium</option>
          <option value="Trial">Trial</option>
          <option value="Regular">Regular</option>
        </select>

        {/* WHATSAPP */}
        <select
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="">WhatsApp</option>
          <option value="true">Added</option>
          <option value="false">Not Added</option>
        </select>

        {/* FORM */}
        <select
          value={formStatus}
          onChange={(e) => setFormStatus(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="">Form</option>
          <option value="true">Completed</option>
          <option value="false">Pending</option>
        </select>

        {/* INTERVIEW */}
        <select
          value={interviewStatus}
          onChange={(e) => setInterviewStatus(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="">Interview</option>
          <option value="true">Done</option>
          <option value="false">Pending</option>
        </select>

        {/* SORT */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm ml-auto"
        >
          <option value="latest">Latest</option>
          <option value="name-asc">Name A–Z</option>
          <option value="name-desc">Name Z–A</option>
          <option value="fees-low">Fees Low → High</option>
          <option value="fees-high">Fees High → Low</option>
          <option value="experience">Experience</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed text-sm text-gray-700">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">SNo</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium w-[1060px]">Location</th>
              <th className="px-4 py-3 font-medium">Class</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Details</th>
              <th className="px-4 py-3 font-medium">Fees Budget</th>
              <th className="px-4 py-3 font-medium">School</th>
              <th className="px-4 py-3 font-medium">Class Date</th>
              <th className="px-4 py-3 font-medium">Gold</th>
              <th className="px-4 py-3 font-medium">Teacher link</th>
              <th className="px-4 py-3 font-medium">Call</th>
              <th className="px-4 py-3 font-medium">Demo</th>
              <th className="px-4 py-3 font-medium">Paid Booking</th>
              <th className="px-4 py-3 font-medium">Last Interaction</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads?.length > 0 ? (
              filteredLeads.map((lead, index) => (
                <tr
                  key={lead._id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 ">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {lead.fullName}
                  </td>
                  <td className="px-4 py-3">{lead.phone}</td>
                  <td className="px-4 py-3 w-[160px] flex">
                    <p
                      title={lead.location?.area}
                      className="text-sm text-gray-700 line-clamp-3"
                    >
                      {lead.location?.area || "-"}
                    </p>
                  </td>
                  <td className="px-4 py-3">{lead.classes || "-"}</td>
                  <td className="px-4 py-3 max-w-md">{lead.subjects}</td>
                  <td className="px-4 py-3 max-w-md">
                    {lead.additionalDetails}
                  </td>
                  <td className="px-4 py-3">
                    {lead.feesBudget ? `₹${lead.feesBudget}` : "-"}
                  </td>
                  <td className="px-4 py-3">{lead?.school}</td>
                  <td className="px-4 py-3">{lead?.classRequiredDate}</td>
                  <td className="px-4 py-3">{lead.isGold ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    <ParentToogle
                      field={"teacherLink"}
                      leadId={lead._id}
                      onUpdated={refresh}
                      value={lead.teacherLink}
                    ></ParentToogle>
                  </td>
                  <td className="px-4 py-3 text-center ">
                    <span>{lead.isCalled ? "Yes" : "No"}</span>
                  </td>
                  <td className="px-4 py-3">
                    {lead.demoDone ? "Done" : "Pending"}
                  </td>
                  <td className="px-4 py-3">
                    {lead.paidBooked ? "Yes" : "No"}
                  </td>
                  <td>
                    {editingId === lead._id ? (
                      <div className="flex flex-col gap-1">
                        <input
                          className="border px-2 py-1 text-xs rounded"
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          placeholder="Type admin note..."
                        />

                        <div className="flex gap-2">
                          <button
                            className="text-green-600 text-xs"
                            onClick={() => saveNote(lead._id)}
                          >
                            Save
                          </button>

                          <button
                            className="text-gray-400 text-xs"
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex flex-col cursor-pointer"
                        onClick={() => {
                          setEditingId(lead._id);
                          setNote(lead.adminNote || "");
                        }}
                      >
                        <span className="text-xs text-gray-500">
                          {lead?.lastActivityText || "No activity yet"}
                        </span>

                        <span className="text-[11px] text-gray-400">
                          {lead?.lastActive
                            ? new Date(lead?.lastActive).toLocaleString()
                            : "—"}
                        </span>
                      </div>
                    )}
                  </td>

                  <td className="px-4 py-2 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* Edit Button */}
                      <button
                        onClick={() => handleEdit(lead)}
                        className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition"
                        title="Edit"
                      >
                        <Pencil size={18} />
                      </button>

                      {/* Delete Button */}
                      {/* <button
                        onClick={() => handleDelete(lead._id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center py-8 text-gray-500">
                  No leads found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg relative overflow-y-auto max-h-[90vh]">
            {/* MODAL HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Update Mentor Lead</h3>
              <button
                onClick={() => setSelectedLead(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* FORM */}
            <div className="p-6">
              <ParentLeadForm
                refresh={refresh}
                selectedLead={selectedLead}
                clearSelection={() => setSelectedLead(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
