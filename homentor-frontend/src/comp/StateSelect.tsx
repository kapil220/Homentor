import React, { useState, useRef, useEffect } from "react";


const StateSelect = ({ selectedState, setSelectedState, allStates }) => {
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


  return (
    <div className="relative w-full max-w-xs" ref={dropdownRef}>
      <button
        type="button"
        className="w-full border border-gray-300 rounded-lg text-nowrap px-4 py-2 text-sm bg-white text-left shadow-sm hover:border-blue-400"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {selectedState
          ? `${selectedState}`
          : "Select State"}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-64 overflow-auto">
          <div className="px-3 py-2 space-y-2 text-sm">
            {allStates.map((state) => (
              <label
              onClick={() => {setSelectedState(state); setIsOpen(false)}}
                key={state}
                className="flex items-center space-x-2 cursor-pointer"
              >
                
                <span>{`${state}`}</span>
              </label>
            ))}

            
          </div>
        </div>
      )}
    </div>
  );
};

export default StateSelect