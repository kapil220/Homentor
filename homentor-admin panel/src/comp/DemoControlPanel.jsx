import axios from "axios";
import { useState } from "react";

export default function DemoControlPanel() {
  const [loading, setLoading] = useState(false);

  const updateAllDemoType = async (type) => {
    try {
      setLoading(true);
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/mentor/demoType/${type}`);
      alert(
        `All mentors switched to ${
          type === "free" ? "Free Demo" : "₹99 Demo"
        }`
      );
    } catch (err) {
      alert("Error updating mentors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">Demo Type Control</h2>

      <div className="flex gap-4">
        <button
          disabled={loading}
          onClick={() => updateAllDemoType("free")}
          className={`px-4 py-2 rounded text-white font-semibold transition ${
            loading
              ? "bg-blue-300 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          Set All to Free Demo
        </button>

        <button
          disabled={loading}
          onClick={() => updateAllDemoType("paid")}
          className={`px-4 py-2 rounded text-white font-semibold transition ${
            loading
              ? "bg-purple-300 cursor-not-allowed"
              : "bg-purple-500 hover:bg-purple-600"
          }`}
        >
          Set All to ₹99 Demo
        </button>
      </div>
    </div>
  );
}
