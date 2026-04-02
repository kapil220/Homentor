import { useEffect, useRef, useState, Fragment } from "react";
import axios from "axios";
import StateData from "../StateData.json";

export default function ParentLeadForm({
  refresh,
  selectedLead,
  clearSelection,
}) {
  const inputRef = useRef(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    location: {
      state: "",
      city: "",
      area: "",
    },
    classes: "",
    subjects: "",
    classRequiredDate: "",
    feesBudget: "",
    additionalDetails: "",
    school: "",
    isGold: false,
  });

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
  
  const handleSubmit = async (e) => {
      e.preventDefault();
      if (isEditMode) {
        await axios.put(
          `https://homentor-backend.onrender.com/api/parent-leads/${editingId}`,
          form
        );
      } else {
        await axios.post(
          "https://homentor-backend.onrender.com/api/parent-leads",
          form
        );
      }
  
      refresh();
      resetForm();
    };
  const [editingId, setEditingId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const resetForm = () => {
    setForm({
      fullName: "",
    phone: "",
    location: {
      state: "",
      city: "",
      area: "",
    },
    classes: "",
    subjects: "",
    classRequiredDate: "",
    feesBudget: "",
    additionalDetails: "",
    school: "",
    isGold: false,
    });

    setIsEditMode(false);
    setEditingId(null);
    clearSelection?.();

    if (inputRef.current) inputRef.current.value = "";
  };

  useEffect(() => {
    if (!selectedLead) return;

    setForm({
      fullName: selectedLead.fullName || "",
      phone: selectedLead.phone || "",
      location: selectedLead.location || { state: "", city: "", area: "" },
      classes: selectedLead.classes || "",
      subjects: selectedLead.subjects || "",
      classRequiredDate: selectedLead.classRequiredDate || "",
      feesBudget: selectedLead.feesBudget || "",
      additionalDetails: selectedLead.additionalDetails || "",
      school: selectedLead.school || "",
      isGold: selectedLead.isGold || false,
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
          Add Parent Lead
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Admin entry for parent onboarding
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

      {/* TEACHING */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className="block text-sm font-medium mb-1"> Class </label>
          <input
            value={form.classes}
            placeholder=""
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
            onChange={(e) => setForm({ ...form, classes: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1"> Subjects </label>
          <input
            value={form.subjects}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
            onChange={(e) => setForm({ ...form, subjects: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {" "}
            Gold Parent{" "}
          </label>
          <input
            type="checkbox"
            checked={form.isGold}
            className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
            onChange={(e) => setForm({ ...form, isGold: e.target.checked })}
          />
        </div>
      </div>
      {/* BIO */}
      <div>
        {" "}
        <label className="block text-sm font-medium mb-1">
          {" "}
          Additionl Info{" "}
        </label>
        <textarea
          value={form.additionalDetails}
          rows={4}
          placeholder="Interview notes, experience, behavior..."
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none resize-none"
          onChange={(e) =>
            setForm({ ...form, additionalDetails: e.target.value })
          }
        />{" "}
      </div>
      {/* CATEGORY & FEES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {" "}
            Class Required Date{" "}
          </label>
          <input
            type="date"
            value={form.classRequiredDate}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
            onChange={(e) =>
              setForm({ ...form, classRequiredDate: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            {" "}
            Fees Budget (₹){" "}
          </label>
          <input
            value={form.feesBudget}
            type="number"
            placeholder="Monthly fees Budget"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
            onChange={(e) => setForm({ ...form, feesBudget: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1"> School </label>
          <input
            value={form.school}
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:outline-none"
            onChange={(e) => setForm({ ...form, school: e.target.value })}
          />
        </div>
      </div>

      {/* ACTION */}
      <div className="flex justify-end pt-6 border-t">
        <button
          type="submit"
          className="bg-black text-white px-8 py-2 rounded-lg hover:bg-gray-900"
        >
          Save Lead
        </button>
      </div>
    </form>
  );
}
