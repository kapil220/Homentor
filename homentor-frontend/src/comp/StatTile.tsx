import React from "react";

type StatTileProps = {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  hint?: string;
  accent?: "blue" | "green" | "yellow" | "red" | "purple";
};

const accentMap: Record<string, string> = {
  blue: "text-blue-600 bg-blue-50",
  green: "text-green-600 bg-green-50",
  yellow: "text-yellow-600 bg-yellow-50",
  red: "text-red-600 bg-red-50",
  purple: "text-purple-600 bg-purple-50",
};

const StatTile: React.FC<StatTileProps> = ({ label, value, icon, hint, accent = "blue" }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start justify-between gap-3">
    <div className="min-w-0">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide truncate">
        {label}
      </p>
      <p className="text-2xl font-bold text-gray-900 mt-1 truncate">{value}</p>
      {hint && <p className="text-xs text-gray-500 mt-0.5 truncate">{hint}</p>}
    </div>
    {icon && (
      <div className={`p-2 rounded-lg shrink-0 ${accentMap[accent]}`}>
        {icon}
      </div>
    )}
  </div>
);

export default StatTile;
