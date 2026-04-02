// MentorRequestCard.tsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminLayout from "../comp/AdminLayout";
import MentorEditModal from "../comp/MentorEditModal";

const MentorRequest = () => {
  useEffect(() => {
    const markViewed = async () => {
      await fetch(
        "https://homentor-backend.onrender.com/api/mentor/mark-viewed",
        { method: "PUT" }
      );
    };
  
    markViewed();
  }, []);
  const [selectedMentor, setSelectedMentor] = useState(null);
  useEffect(() => {
    getMentorData();
  }, []);
  const [mentorList, setMentorList] = useState([]);
  const getMentorData = () => {
    axios
      .get("https://homentor-backend.onrender.com/api/mentor/pending-mentors")
      .then((res) => {
        setMentorList(res.data.data.reverse());
      });
  };

  const [rejectedMentorList, setRejectedMentorList] = useState([]);
  const getRejectedMentorData = () => {
    axios
      .get("https://homentor-backend.onrender.com/api/mentor/rejected-mentors")
      .then((res) => {
        setRejectedMentorList(res.data.data.reverse());
      });
  };

  const handleStatus = (mentorId, status) => {
    axios
      .put(`https://homentor-backend.onrender.com/api/mentor/${mentorId}`, {
        status: status,
      })
      .then((res) => {
        alert("User Status Updated");
        getMentorData();
      });
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...selectedMentor });
  const updateField = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = () => {
    // 🔄 Make an API call here to save `editData`
    axios
      .put(
        `https://homentor-backend.onrender.com/api/mentor/${selectedMentor._id}`,
        selectedMentor
      )
      .then((res) => {
        alert("User Status Updated");
        getMentorData();
        setIsEditing(false);
      });
  };
  const [selectedMentors, setSelectedMentors] = useState([]);

  const getLoginLink = (phone) => {
    return `https://homentor.in/login?phone=${phone}&type=mentor`;
  };

  const shareOnWhatsApp = (phone) => {
    const link = getLoginLink(phone);
    const text = `Login to Homentor using this link:\n${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };
  const resendLoginLink = (mentor) => {
    const link = `https://homentor.in/login?phone=${mentor.phone}&type=mentor`;
    const message = `Hello ${mentor.fullName}, 👋
  
Please login to Homentor using the link below:
${link}

If you face any issue, feel free to contact us.`;

    window.open(
      `https://wa.me/${mentor.phone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <AdminLayout>
      <div className="p-4">
        <div>
          <h2 className="text-2xl font-bold mb-4">Mentor Requests</h2>

          <button onClick={() => getRejectedMentorData()}>
            Rejected Mentor
          </button>
          <button onClick={() => getMentorData()}>Mentor Request</button>
        </div>
        {/* {shareList.length ? (
          <button
            className="w-[200px] m-1  mb-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow transition duration-200 active:scale-95"
            style={{ width: 200 }}
            onClick={() => navigator.clipboard.writeText(link)}
          >
            Copy Share Link
          </button>
        ) : null} */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="py-2 px-4 border-b">S.no.</th>
                <th className="py-2 px-4 border-b">Form Resend</th>
                <th className="py-2 px-4 border-b">Photo</th>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Phone</th>
                <th className="py-2 px-4 border-b">Location</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mentorList.map((mentor, index) => (
                <tr key={mentor._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => resendLoginLink(mentor)}
                      className="text-emerald-600 hover:underline text-sm"
                    >
                      Resend
                    </button>
                  </td>
                  <td className="py-2 px-4 border-b">
                    <img
                      src={mentor.profilePhoto}
                      alt="Profile"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-2 px-4 border-b">{mentor.fullName}</td>
                  <td className="py-2 px-4 border-b">{mentor.phone}</td>
                  <td className="py-2 px-4 border-b">
                    {mentor.location.area}, {mentor.location.city}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <span
                      className={`text-sm px-2 py-1 rounded font-medium ${
                        mentor.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : mentor.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {mentor.status}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b space-x-2">
                    <button
                      onClick={() => setSelectedMentor(mentor)}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleStatus(mentor._id, "Approved")}
                      className="text-green-600 hover:underline text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatus(mentor._id, "Rejected")}
                      className="text-red-600 hover:underline text-sm"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        <MentorEditModal
          getMentorData={getMentorData}
          onSave={handleSaveEdit}
          selectedMentor={selectedMentor}
          setSelectedMentor={setSelectedMentor}
        />
      </div>
    </AdminLayout>
  );
};

export default MentorRequest;
