import { useEffect, useRef, useState, Fragment } from "react";
import axios from "axios";
import StateData from "../StateData.json";

export default function AdminLeadForm({
  refresh,
  selectedLead,
  clearSelection,
}) {
  const inputRef = useRef(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const juniorMatrix = {
    classes: [
      { id: "class-1-5", label: "Class 1–5" },
      { id: "class-6-8", label: "Class 6–8" },
      { id: "class-9-10", label: "Class 9–10" },
    ],
    subjects: [
      "Mathematics",
      "English",
      "Hindi",
      "Science",
      "Social Science",
      "Computer Science",
    ],
  };
  const seniorMatrix = {
    classes: [
      { id: "class-11", label: "Class 11" },
      { id: "class-12", label: "Class 12" },
    ],

    subjects: [
      {
        type: "common",
        label: "Common Subjects",
        items: ["English", "Hindi", "Computer Science"],
      },
      {
        type: "science",
        label: "Science Stream",
        items: ["Physics", "Chemistry", "Mathematics", "Biology"],
      },
      {
        type: "commerce",
        label: "Commerce Stream",
        items: ["Accountancy", "Business Studies", "Economics"],
      },
      {
        type: "art",
        label: "Arts Stream",
        items: ["History", "Geography", "Economics"],
      },
    ],
  };
  const isChecked = (levelId, classId, subject) => {
    return (
      form.teachingPreferences.school?.[classId]?.includes(subject) ?? false
    );
  };
  const toggleSubject = (classId, subject, checked) => {
    setForm((prev) => {
      const existing = prev.teachingPreferences.school?.[classId] || [];

      const updatedSubjects = checked
        ? [...new Set([...existing, subject])]
        : existing.filter((s) => s !== subject);

      return {
        ...prev,
        teachingPreferences: {
          ...prev.teachingPreferences,
          school: {
            ...prev.teachingPreferences.school,
            [classId]: updatedSubjects,
          },
        },
      };
    });
  };
  // Select ALL subjects for a class
  const toggleAllForClass = (classId, checked) => {
    setForm((prev) => ({
      ...prev,
      teachingPreferences: {
        ...prev.teachingPreferences,
        school: {
          ...prev.teachingPreferences.school,
          [classId]: checked ? [...juniorMatrix.subjects] : [],
        },
      },
    }));
  };
  // Select subject across ALL classes
  const toggleAllForSubject = (subject, checked) => {
    setForm((prev) => {
      const updatedClasses = {};

      juniorMatrix.classes.forEach((cls) => {
        updatedClasses[cls.id] = checked
          ? [
              ...new Set([
                ...(prev.teachingPreferences.school?.[cls.id] || []),
                subject,
              ]),
            ]
          : (prev.teachingPreferences.school?.[cls.id] || []).filter(
              (s) => s !== subject
            );
      });

      return {
        ...prev,
        teachingPreferences: {
          ...prev.teachingPreferences,
          school: {
            ...prev.teachingPreferences.school,
            ...updatedClasses,
          },
        },
      };
    });
  };

  const isRowAllChecked = (classId, subjects) =>
    subjects.every((s) => isChecked("school", classId, s));

  const toggleRowAll = (classId, subjects, checked) => {
    setForm((prev) => {
      const prevSubjects = prev.teachingPreferences.school?.[classId] || [];

      const updatedSubjects = checked
        ? [...new Set([...prevSubjects, ...subjects])]
        : prevSubjects.filter((s) => !subjects.includes(s));

      return {
        ...prev,
        teachingPreferences: {
          ...prev.teachingPreferences,
          school: {
            ...prev.teachingPreferences.school,
            [classId]: updatedSubjects,
          },
        },
      };
    });
  };

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    location: {
      state: "",
      city: "",
      area: "",
    },
    teachingRange: "",
    bio: "",
    category: "Regular",
    fees: "",
    teachingPreferences: {
      school: {}, // Add this line
    },
    teachingExperience: "",
    urgentlyNeeded: false,
  });

  const getCityBounds = (city, state) => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();

      geocoder.geocode(
        { address: `${city}, ${state}, India` },
        (results, status) => {
          if (status === "OK" && results[0]) {
            const location = results[0].geometry.location;

            // create approx city bounds
            const bounds = {
              north: location.lat() + 0.15,
              south: location.lat() - 0.15,
              east: location.lng() + 0.15,
              west: location.lng() - 0.15,
            };

            resolve(bounds);
          } else {
            reject("City not found");
          }
        }
      );
    });
  };

  /* ---------- GOOGLE AUTOCOMPLETE ---------- */
  // useEffect(() => {

  //   if (!window.google || !inputRef.current) return;
  //   const autocomplete = new window.google.maps.places.Autocomplete(
  //     inputRef.current,
  //     {
  //       componentRestrictions: { country: "in" },
  //       fields: ["geometry", "address_components", "formatted_address"],
  //     }
  //   );
  //   autocomplete.addListener("place_changed", () => {
  //     const place = autocomplete.getPlace();
  //     if (!place?.formatted_address) return;
  //     const lat = place.geometry.location.lat();
  //     const lon = place.geometry.location.lng();
  //     setForm((prev) => ({
  //       ...prev,
  //       location: {
  //         ...prev.location,
  //         area: place.formatted_address,
  //         lat: lat,
  //         lon: lon,
  //       },
  //     }));
  //   });
  // }, []);
  
  useEffect(() => {
    const initializeAutocomplete = async () => {
      if (!form.location.city || !window.google || !inputRef.current) return;

      const fullAddress = `${form.location.city}, ${form.location.state}, India`;
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            fullAddress
          )}&key=AIzaSyAb6ZthJEvNAczmOeuvFrnwEcMJjhlNpUk`
        );
        const data = await response.json();
        if (data.status !== "OK") {
          console.warn("Failed to get bounds for city:", data.status);
          return;
        }
        const cityLocation = data.results[0].geometry;

        const bounds = new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(
            cityLocation.bounds?.southwest.lat ||
              cityLocation.location.lat - 0.1,
            cityLocation.bounds?.southwest.lng ||
              cityLocation.location.lng - 0.1
          ),
          new window.google.maps.LatLng(
            cityLocation.bounds?.northeast.lat ||
              cityLocation.location.lat + 0.1,
            cityLocation.bounds?.northeast.lng ||
              cityLocation.location.lng + 0.1
          )
        );

        const autocomplete = new window.google.maps.places.Autocomplete(
          inputRef.current,
          {
            types: ["geocode"],
            componentRestrictions: { country: "in" },
            bounds,
            strictBounds: true,
            fields: ["geometry", "address_components", "formatted_address"],
          }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          console.log(place);
          const lat = place.geometry.location.lat();
          const lon = place.geometry.location.lng();
          setForm((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              area: place.formatted_address,
              lat: lat,
              lon: lon,
            },
          }));
        });
      } catch (error) {
        console.error("Error fetching geocode data:", error);
      }
    };
    initializeAutocomplete();
  }, [form.location.city]);
  /* ---------- SUBMIT ---------- */
  const resetForm = () => {
    setForm({
      fullName: "",
      phone: "",
      location: { state: "", city: "", area: "" },
      teachingRange: "",
      bio: "",
      category: "Regular",
      fees: "",
      teachingPreferences: { school: {} },
      teachingExperience: "",
      urgentlyNeeded: false,
    });

    setIsEditMode(false);
    setEditingId(null);
    clearSelection?.();

    if (inputRef.current) inputRef.current.value = "";
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditMode) {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/mentor-leads/${editingId}`,
        form
      );
    } else {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/mentor-leads`,
        form
      );
    }

    refresh();
    resetForm();
  };

  useEffect(() => {
    if (!selectedLead) return;

    setForm({
      fullName: selectedLead.fullName || "",
      phone: selectedLead.phone || "",
      location: selectedLead.location || { state: "", city: "", area: "" },
      teachingRange: selectedLead.teachingRange || "",
      bio: selectedLead.bio || "",
      category: selectedLead.category || "Regular",
      fees: selectedLead.fees || "",
      teachingPreferences: selectedLead.teachingPreferences || { school: {} },
      teachingExperience: selectedLead.teachingExperience || "",
      urgentlyNeeded: selectedLead.urgentlyNeeded || false,
    });

    setEditingId(selectedLead._id);
    setIsEditMode(true);

    if (inputRef.current) {
      inputRef.current.value = selectedLead.location?.area || "";
    }
  }, [selectedLead]);

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl shadow-lg p-8 space-y-10 max-w-6xl mx-auto"
    >
      {/* HEADER */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          Add Mentor Lead
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Admin entry for mentor onboarding
        </p>
      </div>
      {/* BASIC DETAILS */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
          Basic Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium mb-1">
              Full Name *
            </label>
            <input
              value={form.fullName}
              required
              placeholder="Enter full name"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black"
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">
              Phone Number *
            </label>
            <input
              value={form.phone}
              required
              pattern="^[6-9]\d{9}$"
              placeholder="10-digit mobile number"
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black"
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
        </div>
      </section>
      {/* LOCATION */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
          Location Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={form.location.state}
            className="border rounded-lg px-3 py-2"
            onChange={(e) =>
              setForm({
                ...form,
                location: { ...form.location, state: e.target.value },
              })
            }
          >
            <option value="">Select State</option>
            {Object.keys(StateData).map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          <select
            value={form.location.city}
            className="border rounded-lg px-3 py-2"
            disabled={!form.location.state}
            onChange={(e) =>
              setForm({
                ...form,
                location: { ...form.location, city: e.target.value },
              })
            }
          >
            <option value="">Select City</option>

            {form.location.state &&
              StateData[form.location.state]?.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>

          <input
            ref={inputRef}
            placeholder={`Type to search in ${form.location.city || "city"}...`}
            className="border rounded-lg px-3 py-2"
          />
        </div>
      </section>
      {/* JUNIOR MATRIX */}
      <section>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
          Junior Classes (1–10)
        </h3>

        <div className="border rounded-xl overflow-x-auto"></div>
      </section>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* JUNIOR MATRIX */}
        <div className="w-full lg:w-1/2 border rounded-xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left font-semibold">Subjects</th>

                {juniorMatrix.classes.map((cls) => {
                  const allSelected = juniorMatrix.subjects.every((subject) =>
                    isChecked("school", cls.id, subject)
                  );

                  return (
                    <th key={cls.id} className="p-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-medium">{cls.label}</span>
                        <label className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            onChange={() =>
                              toggleAllForClass(cls.id, !allSelected)
                            }
                          />
                          All
                        </label>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody>
              {juniorMatrix.subjects.map((subject) => {
                const subjectAllChecked = juniorMatrix.classes.every((cls) =>
                  isChecked("school", cls.id, subject)
                );

                return (
                  <tr key={subject} className="border-t hover:bg-gray-50">
                    <td className="p-3 font-medium">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={subjectAllChecked}
                          onChange={() =>
                            toggleAllForSubject(subject, !subjectAllChecked)
                          }
                        />
                        {subject}
                      </label>
                    </td>

                    {juniorMatrix.classes.map((cls) => (
                      <td key={cls.id} className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked("school", cls.id, subject)}
                          onChange={(e) =>
                            toggleSubject(cls.id, subject, e.target.checked)
                          }
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* SENIOR MATRIX */}
        <div className="w-full lg:w-1/2 border rounded-xl overflow-x-auto">
          <h3 className="text-sm font-semibold text-gray-700 px-3 py-2 uppercase">
            Senior Classes (11–12)
          </h3>

          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Subjects</th>
                <th className="p-3 text-center">Class 11</th>
                <th className="p-3 text-center">Class 12</th>
              </tr>
            </thead>

            <tbody>
              {seniorMatrix.subjects.map((group) => (
                <Fragment key={group.label}>
                  <tr className="bg-blue-50">
                    <td className="p-3 font-semibold text-blue-700">
                      {group.label}
                    </td>

                    {["class-11", "class-12"].map((cls) => (
                      <td key={cls} className="text-center">
                        <input
                          type="checkbox"
                          checked={isRowAllChecked(cls, group.items)}
                          onChange={() =>
                            toggleRowAll(
                              cls,
                              group.items,
                              !isRowAllChecked(cls, group.items)
                            )
                          }
                        />
                      </td>
                    ))}
                  </tr>

                  {group.items.map((subject) => (
                    <tr key={subject} className="border-t">
                      <td className="p-3">{subject}</td>

                      {["class-11", "class-12"].map((cls) => (
                        <td key={cls} className="text-center">
                          <input
                            type="checkbox"
                            checked={isChecked("school", cls, subject)}
                            onChange={(e) =>
                              toggleSubject(cls, subject, e.target.checked)
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* TEACHING */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1">
            {" "}
            Teaching Range{" "}
          </label>{" "}
          <input
            value={form.teachingRange}
            placeholder="Eg: 5km"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
            onChange={(e) =>
              setForm({ ...form, teachingRange: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {" "}
            Teaching Experience{" "}
          </label>
          <input
            value={form.teachingExperience}
            placeholder="Eg: 4 years"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
            onChange={(e) =>
              setForm({ ...form, teachingExperience: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {" "}
            Urgently Needed{" "}
          </label>
          <input
            type="checkbox"
            checked={form.urgentlyNeeded}
            placeholder="Eg: 4 years"
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
            onChange={(e) =>
              setForm({ ...form, urgentlyNeeded: e.target.checked })
            }
          />
        </div>
      </div>
      {/* BIO */}{" "}
      <div>
        {" "}
        <label className="block text-sm font-medium mb-1">
          {" "}
          Admin Notes / Mentor Bio{" "}
        </label>{" "}
        <textarea
          value={form.bio}
          rows={4}
          placeholder="Interview notes, experience, behavior..."
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none resize-none"
          onChange={(e) => setForm({ ...form, bio: e.target.value })}
        />{" "}
      </div>{" "}
      {/* CATEGORY & FEES */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {" "}
        <div>
          {" "}
          <label className="block text-sm font-medium mb-1">
            {" "}
            Category{" "}
          </label>{" "}
          <select
            value={form.category}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {" "}
            <option>Regular</option> <option>Premium</option>{" "}
            <option>Trial</option>{" "}
          </select>{" "}
        </div>{" "}
        <div>
          {" "}
          <label className="block text-sm font-medium mb-1">
            {" "}
            Fees (₹){" "}
          </label>{" "}
          <input
            value={form.fees}
            type="number"
            placeholder="Monthly fees"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
            onChange={(e) => setForm({ ...form, fees: e.target.value })}
          />{" "}
        </div>{" "}
      </div>
      {/* ACTION */}
      <div className="flex justify-end pt-6 border-t">
        <button
          type="submit"
          className={`px-8 py-2 rounded-lg text-white ${
            isEditMode
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-black hover:bg-gray-900"
          }`}
        >
          {isEditMode ? "Update Lead" : "Save Lead"}
        </button>
      </div>
    </form>
  );
}
