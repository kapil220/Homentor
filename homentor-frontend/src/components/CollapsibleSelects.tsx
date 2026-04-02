import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ChevronDown, ChevronUp } from "lucide-react";

const CollapsibleSelects = () => {
  const [openSelect, setOpenSelect] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedClass, setSelectedClass] = useState("");

  const toggleSelect = (key) => {
    setOpenSelect(openSelect === key ? null : key);
  };

  const handleSelect = (setter, value) => {
    setter(value);
    setOpenSelect(null);
  };

  const options = [
    {
      label: "Subject",
      value: selectedSubject,
      onChange: (val) => handleSelect(setSelectedSubject, val),
      items: [
        "Mathematics",
        "Science",
        "English",
        "Social Studies",
        "Biology",
        "Chemistry",
      ],
      key: "subject",
    },
    {
      label: "State",
      value: selectedState,
      onChange: (val) => handleSelect(setSelectedState, val),
      items: ["Madhya Pradesh"],
      key: "state",
    },
    {
      label: "City",
      value: selectedCity,
      onChange: (val) => handleSelect(setSelectedCity, val),
      items: ["Indore"],
      key: "city",
    },
    {
      label: "Area",
      value: selectedArea,
      onChange: (val) => handleSelect(setSelectedArea, val),
      items: ["Vijay Nagar", "Palasia", "Bhawarkuan"],
      key: "area",
    },
    {
      label: "Class",
      value: selectedClass,
      onChange: (val) => handleSelect(setSelectedClass, val),
      items: ["Class 8", "Class 10", "Class 12"],
      key: "class",
    },
  ];

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div
          key={option.key}
          className="border border-gray-200 rounded-xl shadow-md transition-all bg-white hover:shadow-lg"
        >
          <div
            className="flex justify-between items-center px-4 py-3 cursor-pointer group"
            onClick={() => toggleSelect(option.key)}
          >
            <div>
              <p className="text-sm font-semibold text-gray-700 group-hover:text-indigo-600">
                {option.label}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {option.value || `Select ${option.label}`}
              </p>
            </div>
            <div className="text-gray-400 transition-transform duration-300 ease-in-out">
              {openSelect === option.key ? (
                <ChevronUp className="h-5 w-5 text-indigo-500" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </div>
          </div>

          {/* Dropdown */}
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              openSelect === option.key ? "max-h-60 px-4 pb-4" : "max-h-0"
            }`}
          >
            {openSelect === option.key && (
              <Select onValueChange={option.onChange}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder={`Select ${option.label}`} />
                </SelectTrigger>
                <SelectContent>
                  {option.items.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CollapsibleSelects;
