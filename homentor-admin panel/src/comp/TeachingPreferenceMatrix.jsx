import React from "react";

// --- Class Groups ---
const classGroups = [
  "class-1-6",
  "class-7-8",
  "class-9-10",
  "class-11",
  "class-12",
];

// --- All School Subjects ---
const schoolSubjects = [
  "English",
  "Hindi",
  "Mathematics",
  "Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Social Science",
  "Economics",
  "Business Studies",
  "Accountancy",
  "Computer Science",
];

const TeachingPreferenceMatrix = ({ selectedMentor, updateField }) => {
  const level = "school"; // only working with school level for now
  const teachingPreferences = selectedMentor.teachingPreferences || {};
  const classMap = teachingPreferences[level] || {};

  const isSubjectSelected = (className, subject) => {
    return classMap[className]?.includes(subject);
  };

  const toggleSubject = (className, subject, checked) => {
    const newPreferences = {
      ...teachingPreferences,
      [level]: {
        ...teachingPreferences[level],
        [className]: [...(teachingPreferences[level]?.[className] || [])],
      },
    };

    const subjects = newPreferences[level][className];

    if (checked) {
      if (!subjects.includes(subject)) {
        subjects.push(subject);
      }
    } else {
      newPreferences[level][className] = subjects.filter((s) => s !== subject);
    }

    updateField("teachingPreferences", newPreferences);
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm mt-6 overflow-auto">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">
        Teaching Preferences
      </h3>

      <table className="w-full min-w-[700px] text-sm border border-gray-300">
        <thead className="bg-blue-50">
          <tr>
            <th className="border px-3 py-2 text-left">Subject</th>
            {classGroups.map((className) => (
              <th
                key={className}
                className="border px-3 py-2 text-center capitalize"
              >
                {className.replace(/-/g, " to ").replace("class", "Class")}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {schoolSubjects.map((subject) => (
            <tr key={subject}>
              <td className="border px-3 py-2 font-medium">{subject}</td>
              {classGroups.map((className) => (
                <td
                  key={`${className}-${subject}`}
                  className="border px-3 py-2 text-center"
                >
                  <input
                    type="checkbox"
                    checked={isSubjectSelected(className, subject)}
                    onChange={(e) =>
                      toggleSubject(className, subject, e.target.checked)
                    }
                    className="accent-mentor-yellow-500 h-4 w-4"
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeachingPreferenceMatrix;
