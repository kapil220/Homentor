import axios from "axios";
import { useEffect, useState } from "react";

const DisclaimerManager = () => {
  const [forUser, setForUser] = useState("parent");
  const [content, setContent] = useState("");
  const [disclaimers, setDisclaimers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDisclaimers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/disclaimer/${forUser}`
      );
      console.log(res.data.data)
      setDisclaimers(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch disclaimers", err);
    }
  };

  useEffect(() => {
    fetchDisclaimers();
  }, [forUser]);

  const saveDisclaimer = async () => {
    if (!content.trim()) {
      alert("Disclaimer content is required");
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
       const res =  await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/disclaimer/${editingId}`,
          { content: content, audience: forUser }
        );
      } else {
      
      const res =  await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/disclaimer`,
          { content: content, audience: forUser }
        );
        console.log(res.data)
      }

      setContent("");
      setEditingId(null);
      fetchDisclaimers();
    } catch (err) {
      console.error("Failed to save disclaimer", err);
    } finally {
      setLoading(false);
    }
  };

  const editDisclaimer = (d) => {
    setContent(d.content);
    setForUser(d.forUser);
    setEditingId(d._id);
  };

  const deleteDisclaimer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this disclaimer?"))
      return;

    try {
      await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/disclaimer/${id}`
      );
      fetchDisclaimers();
    } catch (err) {
      console.error("Failed to delete disclaimer", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow border p-6 mt-8">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-800">
          Disclaimer Management
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Manage small informational disclaimers shown to parents or mentors
        </p>
      </div>

      {/* Form */}
      <div className="border rounded-lg p-4 bg-gray-50 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Applicable For
          </label>
          <select
            value={forUser}
            onChange={(e) => setForUser(e.target.value)}
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="parent">Parent</option>
            <option value="mentor">Mentor</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Disclaimer Content
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            placeholder="Enter disclaimer text shown to users..."
            className="w-full border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-3">
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setContent("");
                setForUser("parent");
              }}
              className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          )}

          <button
            onClick={saveDisclaimer}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {editingId ? "Update Disclaimer" : "Add Disclaimer"}
          </button>
        </div>
      </div>

      {/* List */}
      <div className="mt-6 space-y-4">
        {disclaimers.length === 0 && (
          <p className="text-sm text-gray-500 text-center">
            No disclaimers added yet
          </p>
        )}

        {disclaimers.map((d) => (
          <div
            key={d._id}
            className="border rounded-lg p-4 flex justify-between gap-4 hover:shadow-sm transition"
          >
            <div>
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${d.audience === "parent"
                    ? "bg-green-100 text-green-700"
                    : "bg-purple-100 text-purple-700"
                  }`}
              >
                {d.audience.toUpperCase()}
              </span>

              <p className="text-sm text-gray-800 mt-2 whitespace-pre-line">
                {d.content}
              </p>
            </div>

            <div className="flex flex-col gap-2 text-sm">
              <button
                onClick={() => editDisclaimer(d)}
                className="text-blue-600 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => deleteDisclaimer(d._id)}
                className="text-red-600 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisclaimerManager;
