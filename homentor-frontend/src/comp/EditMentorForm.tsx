import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

export default function EditMentorForm({ mentorData, onClose, onSave }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (mentorData) {
      setFormData(mentorData);
    }
  }, [mentorData]);

  const handleChange = (path, value) => {
    // path is an array of keys for nested updates
    setFormData((prev) => {
      const updated = { ...prev };
      let temp = updated;
      for (let i = 0; i < path.length - 1; i++) {
        if (!temp[path[i]]) temp[path[i]] = {};
        temp = temp[path[i]];
      }
      temp[path[path.length - 1]] = value;
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/mentor/${mentorData._id}`,
        formData
      );
      alert("Mentor updated successfully!");
      if (onSave) onSave();
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update mentor.");
    }
  };
const educationLevels = {
    school: {
      label: "School Level",
      classes: {
        "class-1-6": {
          label: "Class 1-6",
          subjects: [
            "Mathematics",
            "English",
            "Hindi",
            "Science",
            "Social Science",
            "Computer Science",
          ],
        },
        "class-7-8": {
          label: "Class 7-8",
          subjects: [
            "Mathematics",
            "English",
            "Hindi",
            "Science",
            "Social Science",
            "Computer Science",
          ],
        },
        "class-9-10": {
          label: "Class 9-10",
          subjects: [
            "Mathematics",
            "Physics",
            "Chemistry",
            "Biology",
            "English",
            "Hindi",
            "Social Science",
            "Computer Science",
          ],
        },
        "class-11": {
          label: "Class 11",
          subjects: [
            "Mathematics",
            "Physics",
            "Chemistry",
            "Biology",
            "English",
            "Economics",
            "Accountancy",
            "Business Studies",
            "Computer Science",
          ],
        },
        "class-12": {
          label: "Class 12",
          subjects: [
            "Mathematics",
            "Physics",
            "Chemistry",
            "Biology",
            "English",
            "Economics",
            "Accountancy",
            "Business Studies",
            "Computer Science",
          ],
        },
      },
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Edit Mentor</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          {/* Profile Photo */}
          <div className="border p-2 rounded">
            <h3 className="font-semibold mb-2">Profile Photo</h3>
            <div className="flex items-center gap-4">
              <img
                src={formData.profilePhoto || "/placeholder.svg"}
                alt="profile"
                className="w-16 h-16 rounded-full border object-cover"
              />
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (!file) return;

                  // Example: Upload to Cloudinary (replace with your API)
                  const formDataUpload = new FormData();
                  formDataUpload.append("file", file);
                  formDataUpload.append("upload_preset", "homentor"); // Replace with your preset
                  try {
                    const res = await fetch(
                      "https://api.cloudinary.com/v1_1/dpveehhtq/image/upload",
                      {
                        method: "POST",
                        body: formDataUpload,
                      }
                    );
                    const data = await res.json();
                    handleChange(["profilePhoto"], data.secure_url);
                  } catch (err) {
                    console.error("Photo upload failed", err);
                    alert("Failed to upload photo");
                  }
                }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              value={formData.fullName || ""}
              onChange={(e) => handleChange(["fullName"], e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              value={formData.phone || ""}
              onChange={(e) => handleChange(["phone"], e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              value={formData.gender || ""}
              onChange={(e) => handleChange(["gender"], e.target.value)}
              className="w-full border p-2 rounded"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Graduation */}
          <div className="border p-2 rounded">
            <h3 className="font-semibold mb-2">Graduation</h3>
            <input
              type="text"
              placeholder="Degree"
              value={formData.graduation?.degree || ""}
              onChange={(e) =>
                handleChange(["graduation", "degree"], e.target.value)
              }
              className="w-full border p-2 rounded mb-2"
            />
            {/* Experience */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Experience
              </label>
              <input
                type="text"
                value={formData.experience || ""}
                onChange={(e) => handleChange(["experience"], e.target.value)}
                className="w-full border p-2 rounded"
              />
            </div>
          </div>

          {/* Location */}
          <div className="border p-2 rounded">
            <h3 className="font-semibold mb-2">Location</h3>
            <input
              type="text"
              placeholder="Area"
              value={formData.location?.area || ""}
              onChange={(e) =>
                handleChange(["location", "area"], e.target.value)
              }
              className="w-full border p-2 rounded mb-2"
            />
            <input
              type="text"
              placeholder="City"
              value={formData.location?.city || ""}
              onChange={(e) =>
                handleChange(["location", "city"], e.target.value)
              }
              className="w-full border p-2 rounded mb-2"
            />
            <input
              type="text"
              placeholder="State"
              value={formData.location?.state || ""}
              onChange={(e) =>
                handleChange(["location", "state"], e.target.value)
              }
              className="w-full border p-2 rounded mb-2"
            />
          </div>

          {/* Teaching Modes */}
          <div className="border p-2 rounded">
            <h3 className="font-semibold mb-2">Teaching Modes</h3>
            <label className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={formData.teachingModes?.homeTuition?.selected || false}
                onChange={(e) =>
                  handleChange(
                    ["teachingModes", "homeTuition", "selected"],
                    e.target.checked
                  )
                }
              />
              Home Tuition
            </label>
            <input
              type="number"
              placeholder="Monthly Price"
              value={formData.teachingModes?.homeTuition?.monthlyPrice || ""}
              onChange={(e) =>
                handleChange(
                  ["teachingModes", "homeTuition", "monthlyPrice"],
                  e.target.value
                )
              }
              className="w-full border p-2 rounded mb-2"
            />
          </div>

          <div className="border p-4 rounded mb-4">
            <h3 className="font-semibold mb-2">Teaching Preferences</h3>

            {Object.keys(educationLevels.school.classes).map((classKey) => {
              const classInfo = educationLevels.school.classes[classKey];
              const selectedSubjects =
                formData?.teachingPreferences?.school[classKey] || [];

              return (
                <div key={classKey} className="mb-4">
                  <p className="font-medium mb-1">{classInfo.label}</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {classInfo.subjects.map((subject) => (
                      <label key={subject} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedSubjects.includes(subject)}
                          onChange={(e) => {
                            let updatedSubjects;
                            if (e.target.checked) {
                              // Add subject if checked
                              updatedSubjects = [...selectedSubjects, subject];
                            } else {
                              // Remove subject if unchecked
                              updatedSubjects = selectedSubjects.filter(
                                (s) => s !== subject
                              );
                            }
                            handleChange(
                              ["teachingPreferences", "school", classKey],
                              updatedSubjects
                            );
                          }}
                        />
                        {subject}
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
