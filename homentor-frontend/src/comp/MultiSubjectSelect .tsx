import React, { useState, useRef, useEffect } from "react";


const MultiSubjectSelect = ({ selectedSubjects, setSelectedSubjects, subjects }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSubject = (subject) => {
    if (selectedSubjects.includes(subject)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subject));
    } else {
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  return (
    <div className="relative w-full max-w-xs" ref={dropdownRef}>
      <button
        type="button"
        className="w-full border border-gray-300 rounded-lg text-nowrap px-4 py-2 text-sm bg-white text-left shadow-sm hover:border-blue-400"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedSubjects.length > 0
          ? selectedSubjects.at(-1)
          : "Select Subject"}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-64 overflow-auto">
          <div className="px-3 py-2 space-y-2 text-sm">
            {subjects.map((subject) => (
              <label
                key={subject}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedSubjects.includes(subject)}
                  onChange={() => toggleSubject(subject)}
                />
                <span>{subject}</span>
              </label>
            ))}

            <button
              className="mt-2 w-full bg-blue-500 text-white py-1.5 rounded hover:bg-blue-600 transition"
              onClick={() => setIsOpen(false)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiSubjectSelect