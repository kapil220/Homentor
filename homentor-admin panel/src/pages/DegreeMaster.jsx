import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../comp/AdminLayout";
import { Pencil, Trash2, X } from "lucide-react";

const API = `${import.meta.env.VITE_API_BASE_URL}/degrees`;

export default function DegreeMaster() {
  const [degrees, setDegrees] = useState([]);
  const [form, setForm] = useState({ name: "", code: "", subjects: "" });
  const [editData, setEditData] = useState(null);

  // Fetch
  const fetchDegrees = async () => {
    const res = await axios.get(API);
    setDegrees(res.data.data);
  };

  useEffect(() => {
    fetchDegrees();
  }, []);

  // Add
  const addDegree = async () => {
    if (!form.name) return alert("Name & Code required");

    await axios.post(API, {
      ...form,
      subjects: form.subjects.split(",").map(s => s.trim()),
    });

    setForm({ name: "", code: "", subjects: "" });
    fetchDegrees();
  };

  // Update
  const updateDegree = async () => {
    await axios.put(`${API}/${editData._id}`, {
      ...editData,
      subjects: editData.subjects.split(",").map(s => s.trim()),
    });

    setEditData(null);
    fetchDegrees();
  };

  // Delete
  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to delete this degree?")) return;
    await axios.delete(`${API}/${id}`);
    fetchDegrees();
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">

        <h1 className="text-2xl font-bold">🎓 Degree & Subject Master</h1>

        {/* Add Form */}
        <div className="bg-white p-5 rounded-xl shadow space-y-3">
          <h2 className="font-semibold">Add New Degree</h2>

          <input
            placeholder="Degree Name (BCom)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 w-full rounded"
          />

        

          <input
            placeholder="Subjects (Accounts, Economics)"
            value={form.subjects}
            onChange={(e) => setForm({ ...form, subjects: e.target.value })}
            className="border p-2 w-full rounded"
          />

          <button
            onClick={addDegree}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Add Degree
          </button>
        </div>

        {/* Degree List */}
        <div className="grid md:grid-cols-2 gap-4">
          {degrees.map((d) => (
            <div
              key={d._id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-start"
            >
              <div>
                <p className="font-semibold">{d.name}</p>

                <div className="flex flex-wrap gap-1 mt-2">
                  {d.subjects.map((s, i) => (
                    <span
                      key={i}
                      className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setEditData({
                      ...d,
                      subjects: d.subjects.join(", "),
                    })
                  }
                  className="text-blue-600"
                >
                  <Pencil size={16} />
                </button>

                <button
                  onClick={() => remove(d._id)}
                  className="text-red-500"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Edit Modal */}
        {editData && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Edit Degree</h3>
                <button onClick={() => setEditData(null)}>
                  <X />
                </button>
              </div>

              <input
                value={editData.name}
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                className="border p-2 w-full rounded"
              />

              <input
                value={editData.subjects}
                onChange={(e) =>
                  setEditData({ ...editData, subjects: e.target.value })
                }
                className="border p-2 w-full rounded"
              />

              <button
                onClick={updateDegree}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full"
              >
                Update Degree
              </button>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
