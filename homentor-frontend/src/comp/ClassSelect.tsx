import React, { useState, useRef, useEffect } from "react";


const ClassSelect = ({ selectedSubjects, handleClassChange }) => {
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

  // const toggleSubject = (subject) => {
    
  //     setSelectedSubjects(subject);
  
  // };

  return (
    <div className="relative w-full max-w-xs" ref={dropdownRef}>
      <button
        type="button"
        className="w-full border border-gray-300 rounded-lg text-nowrap px-4 py-2 text-sm bg-white text-left shadow-sm hover:border-blue-400"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedSubjects
          ? `class ${selectedSubjects}`
          : "Select Class"}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-64 overflow-auto">
          <div className="px-3 py-2 space-y-2 text-sm">
            {[
                  "1",
                  "2",
                  "3",
                  "4",
                  "5",
                  "6",
                  "7",
                  "8",
                  "9",
                  "10",
                  "11",
                  "12",
                ].map((subject) => (
              <label
              onClick={() => {handleClassChange(subject); setIsOpen(false)}}
                key={subject}
                className="flex items-center space-x-2 cursor-pointer"
              >
                
                <span>{`class ${subject}`}</span>
              </label>
            ))}

            
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassSelect