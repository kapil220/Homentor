import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../comp/AdminLayout";

const API = import.meta.env.VITE_API_BASE_URL;

const CredentialsPage = () => {
  const [tab, setTab] = useState("teachers"); // "teachers" | "parents"
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState({}); // { [id]: { name, email, phone, password } }

  const isTeacher = tab === "teachers";
  const userType = isTeacher ? "mentor" : "student";
  const nameOf = (r) => (isTeacher ? r.fullName : r.parentName) || "";

  useEffect(() => {
    setSearch("");
    setEdit({});
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const fetchRows = async () => {
    const url = isTeacher ? `${API}/mentor/approved-mentors` : `${API}/users`;
    const res = await axios.get(url);
    setRows(res.data.data || []);
  };

  const startEdit = (r) =>
    setEdit((s) => ({
      ...s,
      [r._id]: {
        name: nameOf(r),
        email: r.email || "",
        phone: r.phone ?? "",
        password: r.passwordPlain || "",
      },
    }));

  const cancelEdit = (id) =>
    setEdit((s) => {
      const next = { ...s };
      delete next[id];
      return next;
    });

  const setField = (id, field, value) =>
    setEdit((s) => ({ ...s, [id]: { ...s[id], [field]: value } }));

  const save = async (r) => {
    const e = edit[r._id];
    if (!e) return;
    try {
      // 1) name/email/phone via update-credentials
      await axios.put(`${API}/auth/admin/update-credentials`, {
        userId: r._id,
        userType,
        name: e.name,
        email: e.email,
        phone: e.phone,
      });

      // 2) password (only if changed) via reset-password — fires WhatsApp
      const newPwd = (e.password || "").trim();
      if (newPwd && newPwd !== (r.passwordPlain || "")) {
        if (newPwd.length < 4) {
          alert("Password must be at least 4 characters");
          return;
        }
        await axios.post(`${API}/auth/admin/reset-password`, {
          userId: r._id,
          userType,
          password: newPwd,
        });
      }

      // Update local row
      setRows((list) =>
        list.map((row) => {
          if (row._id !== r._id) return row;
          const updated = { ...row, email: e.email, phone: e.phone };
          if (isTeacher) updated.fullName = e.name;
          else updated.parentName = e.name;
          if (newPwd) updated.passwordPlain = newPwd;
          return updated;
        })
      );
      cancelEdit(r._id);
      alert("Saved");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to save");
    }
  };

  const filtered = rows.filter((r) => {
    const q = search.toLowerCase();
    return (
      nameOf(r).toLowerCase().includes(q) ||
      (r.email || "").toLowerCase().includes(q) ||
      String(r.phone ?? "").includes(search)
    );
  });

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Credentials</h1>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab("teachers")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              isTeacher ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            Teachers
          </button>
          <button
            onClick={() => setTab("parents")}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              !isTeacher ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
            }`}
          >
            Parents
          </button>
        </div>

        {/* Search */}
        <input
          placeholder="Search by name, email or phone"
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
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Password</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, index) => {
                const e = edit[r._id];
                return (
                  <tr key={r._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    {e ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            className="border px-2 py-1 rounded w-32 text-xs"
                            value={e.name}
                            onChange={(ev) => setField(r._id, "name", ev.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            className="border px-2 py-1 rounded w-40 text-xs"
                            value={e.email}
                            onChange={(ev) => setField(r._id, "email", ev.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            className="border px-2 py-1 rounded w-32 text-xs"
                            value={e.phone}
                            onChange={(ev) => setField(r._id, "phone", ev.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            className="border px-2 py-1 rounded w-32 text-xs"
                            value={e.password}
                            onChange={(ev) => setField(r._id, "password", ev.target.value)}
                          />
                        </td>
                        <td className="px-4 py-3 flex gap-2">
                          <button onClick={() => save(r)} className="text-green-700 text-xs underline">
                            Save
                          </button>
                          <button onClick={() => cancelEdit(r._id)} className="text-gray-500 text-xs underline">
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3">{nameOf(r) || "—"}</td>
                        <td className="px-4 py-3">{r.email || "—"}</td>
                        <td className="px-4 py-3">{r.phone ?? "—"}</td>
                        <td className="px-4 py-3">
                          <code className="text-xs">{r.passwordPlain || "—"}</code>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => startEdit(r)} className="text-blue-600 text-xs underline">
                            Edit
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CredentialsPage;
