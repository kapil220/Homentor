import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../comp/AdminLayout";

export default function AdminMarginRules() {
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState({ min: "", max: "", margin: "" });
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);

  const fetchRules = async () => {
    try {
      const res = await axios.get(
        "https://homentor-backend.onrender.com/api/margin-rule/margin-rules"
      );
      setRules(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  const handleAddRule = async () => {
    if (!form.min || !form.max || !form.margin) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "https://homentor-backend.onrender.com/api/margin-rule/margin-rules",
        form
      );
      setForm({ min: "", max: "", margin: "" });
      fetchRules();
    } catch (err) {
      console.error(err);
      alert("Failed to add rule");
    }
    setLoading(false);
  };

  const deleteRule = async (id) => {
    if (!window.confirm("Delete this margin rule?")) return;

    try {
      await axios.delete(
        `https://homentor-backend.onrender.com/api/margin-rule/margin-rules/${id}`
      );
      fetchRules();
    } catch (err) {
      alert("Failed to delete.");
    }
  };

  const applyMargins = async () => {
    if (!window.confirm("Apply margin rules to ALL mentors?")) return;

    setApplying(true);
    try {
      await axios.post(
        "https://homentor-backend.onrender.com/api/margin-rule/apply-margins"
      );
      alert("Margins applied successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to apply margins");
    }
    setApplying(false);
  };

  return (
    <AdminLayout>
    <div className="p-6 bg-white rounded-xl shadow-lg border max-w-3xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">🧮 Manage Margin Rules</h1>

      {/* Add Rule Form */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <input
          type="number"
          placeholder="Min Fee"
          className="border p-2 rounded"
          value={form.min}
          onChange={(e) => setForm({ ...form, min: e.target.value })}
        />

        <input
          type="number"
          placeholder="Max Fee"
          className="border p-2 rounded"
          value={form.max}
          onChange={(e) => setForm({ ...form, max: e.target.value })}
        />

        <input
          type="number"
          placeholder="Margin"
          className="border p-2 rounded"
          value={form.margin}
          onChange={(e) => setForm({ ...form, margin: e.target.value })}
        />
      </div>

      <button
        onClick={handleAddRule}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
      >
        {loading ? "Saving..." : "Add Rule ➕"}
      </button>

      {/* Rules Table */}
      <div className="mt-8 border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Fee Range</th>
              <th className="px-4 py-2 text-left">Margin (₹)</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rules.length === 0 ? (
              <tr>
                <td className="px-4 py-4 text-gray-500 text-center" colSpan="3">
                  No rules found
                </td>
              </tr>
            ) : (
              rules.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="px-4 py-2">
                    {r.min} — {r.max}
                  </td>
                  <td className="px-4 py-2">{r.margin}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => deleteRule(r._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Apply Button */}
      <div className="mt-6">
        <button
          onClick={applyMargins}
          disabled={applying}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          {applying ? "Applying..." : "Apply Margins to All Mentors 🚀"}
        </button>
      </div>
    </div>
    </AdminLayout>
  );
}
