import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

const MentorLeadFilter = ({ onMentorSort, setSortBy }) => {
    const inputRef = useRef(null);
    const [address, setAddress] = useState("");
    const [coords, setCoords] = useState({ lat: "", lon: "" });
    // NEW Filters
    const [subject, setSubject] = useState("");
    const [experience, setExperience] = useState("");
    const [price, setPrice] = useState("");
    const [classLevel, setClassLevel] = useState("");

    useEffect(() => {
        setSubject("");
    }, [classLevel]);


    useEffect(() => {
        if (!window.google || !inputRef.current) return;
        const cityBounds = {
            // Example for Indore
            north: 22.85,
            south: 22.6,
            east: 75.95,
            west: 75.7,
        };
        const autocomplete = new window.google.maps.places.Autocomplete(
            inputRef.current,
            {
                types: ["geocode"],
                componentRestrictions: { country: "in" },
                bounds: new window.google.maps.LatLngBounds(
                    new window.google.maps.LatLng(cityBounds.south, cityBounds.west),
                    new window.google.maps.LatLng(cityBounds.north, cityBounds.east)
                ),
                strictBounds: true, fields: ["geometry", "address_components", "formatted_address"],
            }
        );

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry) return;

            const lat = place.geometry.location.lat();
            const lon = place.geometry.location.lng();

            setAddress(place.formatted_address);
            setCoords({ lat, lon });

            // send to parent component (admin)
            onLocationSelect({ address: place.formatted_address, lat, lon });
        });
    }, []);


    // Separate axios function
    const getNearbyMentors = async () => {
        try {
            const response = await axios.get(
                "https://homentor-backend.onrender.com/api/mentor-leads/sorted-mentor-leads",
                {
                    params: {
                        lat: coords.lat,
                        lon: coords.lon,
                        subject: subject,
                        classLevel: classLevel,
                        experience,
                        price
                    },
                }
            );
            let mentors = response.data;
            setSortBy("distance")
            onMentorSort(mentors.sort((a, b) => a.distance - b.distance));
            console.log("Nearby mentors:", mentors);
        } catch (err) {
            console.error("Error fetching nearby mentors:", err);
        }
    };
    return (
        <div className="w-full bg-white p-6 pb-0 rounded-xl shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Autocomplete Input */}
                <div className="mb-4">
                    <label className="text-sm font-medium mb-1 block">Search Area / Landmark</label>
                    <input
                        ref={inputRef}
                        placeholder="Type to search…"
                        className="border w-full px-3 py-2 rounded-lg shadow-sm focus:ring focus:ring-blue-300"
                    />
                </div>
                <div>
                    <label className="text-sm font-medium mb-1 block">Experience</label>
                    <input className="border px-3 py-2 rounded-lg w-full" onChange={(e) => setExperience(e.target.value)} placeholder="Enter Experience" />

                </div>
                <div>
                    <label className="text-sm font-medium mb-1 block">Price</label>

                    <input className="border px-3 py-2 rounded-lg w-full" onChange={(e) => setPrice(e.target.value)} placeholder="Enter Price" />
                </div>
                <button
                    onClick={() => getNearbyMentors()
                    }
                    className="h-[6vh] mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                    Sort Nearby Mentors
                </button>
            </div>
        </div>
    );
};

export default MentorLeadFilter;
