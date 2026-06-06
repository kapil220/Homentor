import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../comp/AdminLayout";

const ParentsPage = () => {
  const [parents, setParents] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedParent, setSelectedParent] = useState(null);
  const [pwdEdit, setPwdEdit] = useState({}); // { [id]: { editing, value } }

  const startEditPwd = (p) => setPwdEdit((s) => ({ ...s, [p._id]: { editing: true, value: p.passwordPlain || "" } }));
  const cancelEditPwd = (id) => setPwdEdit((s) => ({ ...s, [id]: { editing: false, value: "" } }));
  const savePwd = async (p) => {
    const next = pwdEdit[p._id]?.value || "";
    if (!next || next.length < 4) { alert("Password must be at least 4 chars"); return; }
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/admin/reset-password`, {
        userId: p._id, userType: "student", password: next,
      });
      setParents((rows) => rows.map((r) => r._id === p._id ? { ...r, passwordPlain: next } : r));
      setPwdEdit((s) => ({ ...s, [p._id]: { editing: false, value: "" } }));
    } catch (e) { alert(e?.response?.data?.message || "Failed to update password"); }
  };

  useEffect(() => {
    fetchParents();
  }, []);

  const fetchParents = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_BASE_URL}/users`
    );
    setParents(res.data.data || []);
  };

  const filteredParents = parents.filter(
    (p) =>
      p.parentName?.toLowerCase().includes(search.toLowerCase()) ||
      p.phone?.toString().includes(search)
  );

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Parents Management</h1>

        {/* Search */}
        <input
          placeholder="Search by name or phone"
          className="border px-4 py-2 rounded-lg mb-4 w-80"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-3">SNo.</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Children</th>
                <th className="px-4 py-3">Password</th>
                <th className="px-4 py-3">Disclaimer</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredParents.map((p, index) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{p.parentName || "—"}</td>
                  <td className="px-4 py-3">{p.phone}</td>
                  <td className="px-4 py-3 w-[20%]">
                    {p.address ? `${p?.address?.street}, ${p?.address?.city}` : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {p.children?.length || 0}
                  </td>

                  {/* Password */}
                  <td className="px-4 py-3 text-center">
                    {pwdEdit[p._id]?.editing ? (
                      <div className="flex items-center gap-1 justify-center">
                        <input
                          className="border px-2 py-1 rounded w-28 text-xs"
                          value={pwdEdit[p._id].value}
                          onChange={(e) => setPwdEdit((s) => ({ ...s, [p._id]: { ...s[p._id], value: e.target.value } }))}
                        />
                        <button onClick={() => savePwd(p)} className="text-green-700 text-xs underline">Save</button>
                        <button onClick={() => cancelEditPwd(p._id)} className="text-gray-500 text-xs underline">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 justify-center">
                        <code className="text-xs">{p.passwordPlain || "—"}</code>
                        <button onClick={() => startEditPwd(p)} className="text-blue-600 text-xs underline">Edit</button>
                      </div>
                    )}
                  </td>

                  {/* Disclaimer Status */}
                  <td className="px-4 py-3 text-center">
                    {p.disclaimerAccepted ? (
                      <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                        Accepted
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-center">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setSelectedParent(p)}
                      className="text-blue-600 hover:underline text-xs"
                    >
                      View Disclaimers
                    </button>
                  </td>
                </tr>
              ))}

              {filteredParents.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-400">
                    No parents found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Disclaimer Modal */}
        {selectedParent && (
          <DisclaimerViewModal
            parent={selectedParent}
            onClose={() => setSelectedParent(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

export default ParentsPage;
