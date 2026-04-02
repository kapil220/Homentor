import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import StateData from "../StateData.json";

const AdminLocationSelector = ({ onLocationSelect, onMentorSort }) => {
  const inputRef = useRef(null);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState({ lat: "", lon: "" });
  // NEW Filters
  const [subject, setSubject] = useState("");
  const [classLevel, setClassLevel] = useState("");
  const [rank, setRank] = useState("");
  const [location, setLocation] = useState({ city: "", state: "" });

  useEffect(() => {
    const initializeAutocomplete = async () => {
      if (!location.city || !window.google || !inputRef.current) return;

      const fullAddress = `${location.city}, ${location.state}, India`;
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
          setCoords({ lat, lon })
        });
      } catch (error) {
        console.error("Error fetching geocode data:", error);
      }
    };
    initializeAutocomplete();
  }, [location.city]);

  // useEffect(() => {
  //     if (!window.google || !inputRef.current) return;

  //     const cityBounds = {
  //         // Example for Indore
  //         north: 22.85,
  //         south: 22.6,
  //         east: 75.95,
  //         west: 75.7,
  //     };
  //     const autocomplete = new window.google.maps.places.Autocomplete(
  //         inputRef.current,
  //         {
  //             types: ["geocode"],
  //             componentRestrictions: { country: "in" },
  //             bounds: new window.google.maps.LatLngBounds(
  //                 new window.google.maps.LatLng(cityBounds.south, cityBounds.west),
  //                 new window.google.maps.LatLng(cityBounds.north, cityBounds.east)
  //             ),
  //             strictBounds: true, fields: ["geometry", "address_components", "formatted_address"],
  //         }
  //     );

  //     autocomplete.addListener("place_changed", () => {
  //         const place = autocomplete.getPlace();
  //         if (!place.geometry) return;

  //         const lat = place.geometry.location.lat();
  //         const lon = place.geometry.location.lng();

  //         setAddress(place.formatted_address);
  //         setCoords({ lat, lon });

  //         // send to parent component (admin)
  //         onLocationSelect({ address: place.formatted_address, lat, lon });
  //     });
  // }, []);

  // Separate axios function
  const getNearbyMentors = async () => {
    try {
      const response = await axios.get(
        "https://homentor-backend.onrender.com/api/mentor/nearby-mentors",
        {
          params: {
            lat: coords.lat,
            lon: coords.lon,
            subject: subject,
            classLevel: classLevel,
            rank: rank,
          },
        }
      );
      let mentors = response.data;

      // ⬇ FRONTEND FILTER PRIORITY
      const strongMatch = mentors.filter((m) => {
        const matchSubject = subject ? m.subjects?.includes(subject) : true;
        const matchClass = classLevel ? m.classes?.includes(classLevel) : true;
        const matchRank = rank ? Number(m.adminRanking) === Number(rank) : true;

        return matchSubject && matchClass && matchRank;
      });

      const weakMatch = mentors.filter((m) => !strongMatch.includes(m));

      // Merge but keep "not matching" at the end
      const finalSorted = [...strongMatch, ...weakMatch];
      onMentorSort(finalSorted);
      console.log("Nearby mentors:", finalSorted);
    } catch (err) {
      console.error("Error fetching nearby mentors:", err);
    }
  };
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4">Search Location</h2>

      {/* Autocomplete Input */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={location.state}
          className="border rounded-lg px-3 py-2"
          onChange={(e) =>
            setLocation({
              ...location,
              state: e.target.value,
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
          value={location.city}
          className="border rounded-lg px-3 py-2"
          disabled={!location.state}
          onChange={(e) =>
            setLocation({
              ...location,
              city: e.target.value,
            })
          }
        >
          <option value="">Select City</option>

          {location.state &&
            StateData[location.state]?.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
        </select>

        <input
          ref={inputRef}
          placeholder={`Type to search in ${location.city || "city"}...`}
          className="border rounded-lg px-3 py-2"
        />
      </div>

      {/* Current Address Preview */}
      {address && (
        <p className="text-gray-600 text-sm mb-4">
          <strong>Selected:</strong> {address}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Subject Filter */}
        <div>
          <label className="text-sm mb-1 block">Subject</label>
          <select
            className="border px-3 py-2 rounded-lg w-full"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            <option value="">All Subjects</option>
            <option value="Computer">Computer</option>
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Science">Science</option>
            <option value="Social science">Social science</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Computerscience">Computerscience</option>
            <option value="Physics">Physics</option>
          </select>
        </div>

        {/* Class Filter */}
        <div>
          <label className="text-sm mb-1 block">Class</label>
          <select
            className="border px-3 py-2 rounded-lg w-full"
            value={classLevel}
            onChange={(e) => setClassLevel(e.target.value)}
          >
            <option value="">All Classes</option>
            <option value="class-1-5">Class 1–5</option>
            <option value="class-6-8">Class 6–8</option>
            <option value="class-9-10">Class 9–10</option>
            <option value="class-11">Class 11</option>
            <option value="class-12">Class 12</option>
          </select>
        </div>

        {/* Rank Filter */}
        <div>
          <label className="text-sm mb-1 block">Rank</label>
          <select
            className="border px-3 py-2 rounded-lg w-full"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
          >
            <option value="">All Ranks</option>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>
      <button
        onClick={() => getNearbyMentors()}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        Find Nearby Mentors
      </button>
    </div>
  );
};

export default AdminLocationSelector;
