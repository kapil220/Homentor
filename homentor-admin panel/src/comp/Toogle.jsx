import { useState } from "react";
import axios from "axios";

export default function Toogle({
  leadId,
  value,
  onUpdated,
}) {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return;

    try {
      setLoading(true);

      await axios.put(
        `https://homentor-backend.onrender.com/api/mentor-leads/${leadId}`,
        { interviewDone: !value
         }
      );

      onUpdated?.();
    } catch (error) {
      alert("Failed to update interview status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`relative inline-flex h-6 w-11 items-center rounded-full
          transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
          ${value ? "bg-green-500" : "bg-gray-300"}
          ${loading ? "opacity-60 cursor-not-allowed" : ""}
        `}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white transition
            ${value ? "translate-x-5" : "translate-x-1"}
          `}
        />

        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg
              className="w-4 h-4 animate-spin text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"
              />
            </svg>
          </span>
        )}
      </button>

      <span
        className={`text-xs font-medium ${
          value ? "text-green-600" : "text-gray-500"
        }`}
      >
        {value ? "Yes" : "No"}
      </span>
    </div>
  );
}
