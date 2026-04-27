import React from "react";

const accentMap = {
  blue: "text-blue-600 bg-blue-50",
  green: "text-green-600 bg-green-50",
  yellow: "text-yellow-600 bg-yellow-50",
  red: "text-red-600 bg-red-50",
  purple: "text-purple-600 bg-purple-50",
};

const StatTile = ({ label, value, icon, hint, accent = "blue", onClick }) => {
  const content = (
    <>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">
          {label}
        </p>
        <p className="text-2xl font-bold text-gray-900 mt-1 truncate">{value}</p>
        {hint && <p className="text-xs text-gray-500 mt-0.5 truncate">{hint}</p>}
      </div>
      {icon && (
        <div className={`p-2 rounded-lg shrink-0 ${accentMap[accent] || accentMap.blue}`}>
          {icon}
        </div>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-3 text-left w-full hover:shadow-md hover:border-blue-300 transition"
      >
        {content}
      </button>
    );
  }
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-3">
      {content}
    </div>
  );
};

export default StatTile;
