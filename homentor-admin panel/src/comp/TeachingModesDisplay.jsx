import { useState } from "react";
import { IndianRupee, Pencil } from "lucide-react";
import axios from "axios";

export default function TeachingModesDisplay({ mentorData, isAdmin = true }) {
  const [modes, setModes] = useState(mentorData.teachingModes || {});
  const [editingMode, setEditingMode] = useState(null);
  const [newMargin, setNewMargin] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleEdit = (modeName, currentMargin) => {
    setEditingMode(modeName);
    setNewMargin(currentMargin);
  };

  const handleSave = async (modeName) => {
    try {
      setLoading(true);
      const updated = { ...modes };
      updated[modeName].margin = newMargin;

      await axios.put(
        `https://homentor-backend.onrender.com/api/mentor/${mentorData._id}`,
        { teachingModes: updated }
      );

      setModes(updated);
      setEditingMode(null);
      alert("✅ Margin updated successfully!");
    } catch (error) {
      console.error(error);
      alert("❌ Failed to update margin");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl shadow-sm border border-yellow-200 mt-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-t-2xl px-4 py-3 flex items-center gap-2">
        <IndianRupee className="h-5 w-5" />
        <h3 className="font-semibold text-base">Teaching Modes & Pricing</h3>
      </div>

      {/* Modes List */}
      {Object.entries(modes).map(([modeName, modeData], index) => {
        const monthlyPrice = Number(modeData?.monthlyPrice) || 0;
        const margin = Number(modeData?.margin) || 0;
        const finalPrice = monthlyPrice + margin;

        return (
          <div
            key={index}
            className="bg-yellow-50 border border-yellow-200 rounded-lg mx-4 mt-4 p-4"
          >
            {/* Title and Edit */}
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-medium text-yellow-700 text-base">
                {modeName?.replace(/^./, (c) => c.toUpperCase())}
              </h4>

              {isAdmin && (
                <button
                  onClick={() => handleEdit(modeName, margin)}
                  className="text-sm flex items-center gap-1 text-yellow-700 hover:text-yellow-900"
                >
                  <Pencil className="h-4 w-4" /> Edit
                </button>
              )}
            </div>

            {/* Fee Info */}
            <div className="flex flex-col gap-1 text-sm text-gray-800">
              <p>
                <span className="font-semibold">Teacher Fee:</span>{" "}
                ₹{monthlyPrice.toLocaleString()}
              </p>

              <p>
                <span className="font-semibold">Showing Fee:</span>{" "}
                ₹{finalPrice.toLocaleString()}{" "}
                <span className="text-gray-500 text-xs">
                  (includes margin ₹{margin.toLocaleString()})
                </span>
              </p>
            </div>

            {/* Margin Editor (Admin Only) */}
            {isAdmin && editingMode === modeName && (
              <div className="mt-4 flex items-center gap-2">
                <input
                  type="number"
                  value={newMargin}
                  onChange={(e) => setNewMargin(Number(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 w-24"
                  placeholder="Enter margin"
                />
                <button
                  onClick={() => handleSave(modeName)}
                  disabled={loading}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium text-white ${
                    loading
                      ? "bg-yellow-300 cursor-not-allowed"
                      : "bg-yellow-500 hover:bg-yellow-600"
                  }`}
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => setEditingMode(null)}
                  className="px-3 py-1.5 rounded-lg text-sm border border-gray-300 text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
