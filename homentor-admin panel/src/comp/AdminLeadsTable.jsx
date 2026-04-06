import { useEffect, useState } from "react";
import TeachingPreferencesModal from "./TeachingPreferencesModal";
import WhatsappToggle from "./WhatsappToggle";
import Toogle from "./Toogle";
import MentorLeadFilter from "./MentorLeadFilter";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import AdminLeadForm from "./AdminLeadForm";

export function AdminLeadsTable({ leads, refresh, setLeads }) {
  const [openPrefs, setOpenPrefs] = useState(null);
  const renderTeachingPreferences = (prefs, leadId) => {
    if (!prefs?.school) return "-";

    const classes = Object.keys(prefs.school);

    return (
      <div className="text-xs space-y-1">
        <div className="flex gap-1">
          {classes.map((cls) => (
            <span
              key={cls}
              className="px-2 py-0.5 rounded-full text-nowrap bg-blue-100 text-blue-700 font-medium"
            >
              {cls.replace("class-", " ").toUpperCase()}
            </span>
          ))}
        </div>

        <button
          onClick={() => setOpenPrefs(leadId)}
          type="button"
          className="text-[11px] text-blue-600 hover:underline"
        >
          View subjects
        </button>
        {openPrefs === leadId && (
          <TeachingPreferencesModal
            open
            onClose={() => setOpenPrefs(null)}
            schoolPrefs={prefs.school}
          />
        )}
      </div>
    );
  };
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [interviewStatus, setInterviewStatus] = useState("");
  const [urgentlyNeeded, seturgentlyNeeded] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [status, setStatus] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [classLevel, setClassLevel] = useState("");
  const [subject, setSubject] = useState([]);
  const juniorMatrix = {
    classes: [
      { id: "class-1-5", label: "Class 1–5" },
      { id: "class-6-8", label: "Class 6–8" },
      { id: "class-9-10", label: "Class 9–10" },
    ],
    subjects: [
      "Mathematics",
      "English",
      "Hindi",
      "Science",
      "Social Science",
      "Computer Science",
    ],
  };
  const seniorMatrix = {
    classes: [
      { id: "class-11", label: "Class 11" },
      { id: "class-12", label: "Class 12" },
    ],

    subjects: [
      {
        type: "common",
        label: "Common Subjects",
        items: ["English", "Hindi", "Computer Science"],
      },
      {
        type: "science",
        label: "Science Stream",
        items: ["Physics", "Chemistry", "Mathematics", "Biology"],
      },
      {
        type: "commerce",
        label: "Commerce Stream",
        items: ["Accountancy", "Business Studies", "Economics"],
      },
      {
        type: "art",
        label: "Arts Stream",
        items: ["History", "Geography", "Economics"],
      },
    ],
  };
  const isJuniorClass = ["class-1-5", "class-6-8", "class-9-10"].includes(
    classLevel
  );
  const isSeniorClass = ["class-11", "class-12"].includes(classLevel);
  const availableSubjects = isJuniorClass
    ? juniorMatrix.subjects
    : isSeniorClass
    ? seniorMatrix.subjects.flatMap((group) => group.items)
    : [];
  useEffect(() => {
    setSubject("");
  }, [classLevel]);

  const handleNearbyMentors = (sortedList) => {
    setLeads(sortedList); // replace existing mentors
  };
  const filteredLeads = leads
    ?.filter((lead) => {
      const text = `${lead.fullName} ${lead.phone} ${
        lead.location?.area || ""
      }`.toLowerCase();

      const schoolPrefs = lead.teachingPreferences?.school || {};

      // ✅ CLASS FILTER
      const matchClass = classLevel
        ? Array.isArray(schoolPrefs[classLevel])
        : true;

      // ✅ SUBJECT FILTER
      // const matchSubject = subject
      //   ? classLevel
      //     ? // subject inside selected class
      //       schoolPrefs[classLevel]?.includes(subject)
      //     : // subject in ANY class
      //       Object.values(schoolPrefs).some((subjects) =>
      //         subjects.includes(subject)
      //       )
      //   : true;
      const matchSubject =
        subject?.length > 0
          ? classLevel
            ? // subjects inside selected class
              subject.some((sub) => schoolPrefs[classLevel]?.includes(sub))
            : // subjects in ANY class
              subject.some((sub) =>
                Object.values(schoolPrefs).some((subjects) =>
                  subjects.includes(sub)
                )
              )
          : true;

      return (
        text.includes(search.toLowerCase()) &&
        (!category || lead.category === category) &&
        (!whatsapp || String(lead.whatsappAdded) === whatsapp) &&
        (!formStatus || String(lead.leadFormFilled) === formStatus) &&
        (!interviewStatus || String(lead.interviewDone) === interviewStatus) &&
        (!urgentlyNeeded || String(lead.urgentlyNeeded) === urgentlyNeeded) &&
        (!status || lead.status === status) && // ✅ STATUS FILTER
        matchClass &&
        matchSubject
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
        case "distance":
          return a.distance - b.distance;
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const handleLinkSend = (leadId) => {
    axios
      .put(`${import.meta.env.VITE_API_BASE_URL}/mentor-leads/${leadId}`, {
        linkSend: true,
        staus: "link_send",
      })
      .then(() => refresh());
  };
  const handleEdit = (lead) => {
    setSelectedLead(lead);
  };

  const handleDelete = (leadId) => {
    axios
      .delete(
        `${import.meta.env.VITE_API_BASE_URL}/mentor-leads/${leadId}`
      )
      .then(() => refresh());
  };
  const MultiSelect = ({ options, value, onChange, disabled }) => {
    const toggle = (item) => {
      if (value.includes(item)) {
        onChange(value.filter((v) => v !== item));
      } else {
        onChange([...value, item]);
      }
    };

    return (
      
      <div className="border rounded-xl bg-white shadow-sm max-h-48 overflow-y-auto">
        {options.map((opt) => {
          const checked = value.includes(opt);

          return (
            <label
              key={opt}
              className={`
          flex items-center justify-between
          px-3 py-2 text-sm cursor-pointer
          transition
          ${
            checked
              ? "bg-blue-50 text-blue-700 font-medium"
              : "hover:bg-gray-50 text-gray-700"
          }
        `}
            >
              {/* Left side: Checkbox + Text */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(opt)}
                  disabled={disabled}
                  className="accent-blue-600 cursor-pointer"
                />

                <span className="truncate">{opt}</span>
              </div>

              {/* Right side: Selected Tick */}
              {checked && (
                <span className="text-blue-600 text-xs font-semibold">✓</span>
              )}
            </label>
          );
        })}
      </div>
      
    );
  };

  console.log(leads)

  return (
    <div className="mt-8 bg-white rounded-xl shadow-md overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-semibold text-gray-800">
          Mentor Leads Table
        </h3>
        <p className="text-sm text-gray-500">
          Track mentor onboarding progress
        </p>
      </div>
      <MentorLeadFilter
        onMentorSort={handleNearbyMentors}
        setSortBy={setSortBy}
      ></MentorLeadFilter>
      <div className="p-4 bg-gray-50 border-b flex flex-wrap gap-3">
        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search name / phone / location"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm w-64"
        />
        {/* Class Filter */}
        <div>
         
          <select
            className="border px-3 py-2 rounded-lg w-full"
            value={classLevel}
            onChange={(e) => setClassLevel(e.target.value)}
          >
            <option value="">All Classes</option>
            <option value="class-1-5">Class 1–5</option>
            <option value="class-6-8">Class 6–8</option>
            <option value="class-9-10">Class 9–10</option>
            <option value="class-11">Class 11</option>
            <option value="class-12">Class 12</option>
          </select>
        </div>
        {/* Subject Filter */}
        <div>
        
          <MultiSelect
            options={availableSubjects}
            value={subject}
            onChange={setSubject}
            disabled={!classLevel}
          />
        </div>
        {/* STATUS */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="">All Status</option>
          <option value="lead_generated">Lead Generated</option>
          <option value="first_form">First Form</option>
          <option value="interview">Interview</option>
          <option value="second_form">Second Form</option>
          <option value="link_send">Link Sent</option>
          <option value="call_done">Call Done</option>
          <option value="demo_booked">Demo Booked</option>
          <option value="paid_booking">Paid Booking</option>
        </select>

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

        <select
          value={urgentlyNeeded}
          onChange={(e) => seturgentlyNeeded(e.target.value)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="">Urgency</option>
          <option value="true">Urgent</option>
          <option value="false">Not Urgent</option>
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
              <th className="px-4 py-3 font-medium">S.No.</th>
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium w-[1060px]">Location</th>
              <th className="px-4 py-3 font-medium">Range</th>
              <th className="px-4 py-3 font-medium">Class & Subject</th>
              <th className="px-4 py-3 font-medium">Experience</th>
              <th className="px-4 py-3 font-medium">Urgency</th>
              <th className="px-4 py-3 font-medium">Fees</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Bio</th>
              <th className="px-4 py-3 font-medium">Added on WhatsApp</th>
              <th className="px-4 py-3 font-medium text-center">Form</th>
              <th className="px-4 py-3 font-medium">Form 2</th>
              <th className="px-4 py-3 font-medium">Link send</th>
              <th className="px-4 py-3 font-medium">Call Done</th>
              <th className="px-4 py-3 font-medium text-center">Interview</th>
              <th className="px-4 py-3 font-medium">Demo</th>
              <th className="px-4 py-3 font-medium">Paid Booking</th>
              <th className="px-4 py-3 font-medium">Last Interaction</th>
              <th className="px-4 py-3 font-medium">Actions</th>
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
                  <td className="px-4 py-3">
                    <label>{parseInt(lead.teachingRange) || "-"} km</label>
                    {lead.distance && (
                      <button className="text-[11px] text-blue-600 hover:underline">
                        {lead.distance.toFixed(1)} km
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 max-w-md">
                    {renderTeachingPreferences(
                      lead.teachingPreferences,
                      lead._id
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {lead.teachingExperience || "-"} year
                  </td>
                  <td className="px-4 py-3">
                    {lead.urgentlyNeeded ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-3">
                    {lead.fees ? `₹${lead.fees}` : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.category === "Premium"
                          ? "bg-purple-100 text-purple-700"
                          : lead.category === "Trial"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {lead.category || "Regular"}
                    </span>
                  </td>
                  <td className="px-4 py-3 w-[160px] flex">
                    <p
                      title={lead.bio}
                      className="text-sm text-gray-700 line-clamp-3"
                    >
                      {lead.bio || "-"}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <WhatsappToggle
                      leadId={lead._id}
                      value={lead.whatsappAdded}
                      onUpdated={refresh}
                    />
                  </td>
                  {/* FORM STATUS */}
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        lead.leadFormFilled
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {lead.leadFormFilled ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        lead.secondForm
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {lead.secondForm ? "Completed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={lead.linkSend}
                      onChange={() => handleLinkSend(lead._id)}
                    ></input>
                  </td>
                  <td className="px-4 py-3">{lead.isCalled ? "Yes" : "No"}</td>
                  <td className="px-4 py-3 text-center">
                    <Toogle
                      leadId={lead._id}
                      onUpdated={refresh}
                      value={lead.interviewDone}
                    ></Toogle>
                  </td>
                  <td className={`px-4 py-3 `}>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        lead.demoBooked
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {lead.demoBooked ? "Done" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        lead.paidBooked
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {lead.paidBooked ? "Yes" : "No"}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500">
                        {lead.mentorId?.lastActivityText || "No activity yet"}
                      </span>

                      <span className="text-[11px] text-gray-400">
                        {lead.mentorId?.lastActive
                          ? new Date(lead.mentorId.lastActive).toLocaleString()
                          : "—"}
                      </span>
                    </div>
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
                      <button
                        onClick={() => handleDelete(lead._id)}
                        className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
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
              <AdminLeadForm
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
