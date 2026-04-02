import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter } from "lucide-react"; // filter icon

const filters = [
  { key: "subject", label: "Subject" },
  { key: "state", label: "State" },
  { key: "city", label: "City" },
  { key: "area", label: "Area" },
  { key: "class", label: "Class" },
];

export default function RadialFilterMenu() {
  const [open, setOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);

  // Positions for 5 options evenly spread in circle around center
  const radius = 100;
  const angleStep = (2 * Math.PI) / filters.length;

  return (
    <div className="relative  mx-auto">
      {/* Center icon button */}
      <button
        onClick={() => setOpen(!open)}
        className="z-10 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition"
      >
        <Filter className="w-5 h-5" />
      </button>

      {/* Radial menu */}
      <AnimatePresence>
        {open && !selectedFilter && (
          <>
            {filters.map((filter, i) => {
              const angle = i * angleStep - Math.PI / 2; // start from top
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);

              return (
                <motion.button
                  key={filter.key}
                  initial={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                  animate={{ x, y, opacity: 1, scale: 1 }}
                  exit={{ x: 0, y: 0, opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onClick={() => setSelectedFilter(filter.key)}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-indigo-600 focus:outline-none"
                >
                  {filter.label}
                </motion.button>
              );
            })}
          </>
        )}
      </AnimatePresence>

      {/* Show select options when a filter is selected */}
      {selectedFilter && (
        <div
        className="absolute left-1/2 top-full mt-4 w-64 -translate-x-1/2 bg-white rounded-lg shadow-lg p-4 z-20"
        style={{ minWidth: 240 }}
      >
        <button
          onClick={() => setSelectedFilter(null)}
          className="mb-3 text-indigo-600 text-sm hover:underline"
        >
          ← Back to filters
        </button>
    
        <p className="mb-3 font-semibold text-gray-700">
          Select {selectedFilter.charAt(0).toUpperCase() + selectedFilter.slice(1)}
        </p>
    
        <ul className="max-h-44 overflow-y-auto space-y-1">
          {["Option 1", "Option 2", "Option 3"].map((opt) => (
            <li
              key={opt}
              className="cursor-pointer rounded px-3 py-2 hover:bg-indigo-100"
              onClick={() => {
                alert(`Selected ${opt} for ${selectedFilter}`);
                setSelectedFilter(null);
                setOpen(false);
              }}
            >
              {opt}
            </li>
          ))}
        </ul>
      </div>
      )}
    </div>
  );
}
