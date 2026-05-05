import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger, 
  SelectValue,
} from "@/components/ui/select";
import TornCard from "@/components/TornCard";
import SVGFilter from "@/components/SVGFilter";
import SearchBar from "@/components/SearchBar";
import axios from "axios";
import StateData from "../StateData.json";
import PriceSlider from "@/components/PriceSlider";
import MultiSubjectSelect from "@/comp/MultiSubjectSelect ";
import ClassSelect from "@/comp/ClassSelect";
import StateSelect from "@/comp/StateSelect";
import { Input } from "@/components/ui/input";
import { Award, Users, Filter, Sparkles, Search as SearchIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
const classSubjects = {
  "1": [
    "Mathematics",
    "English",
    "Hindi",
    "Science",
    "Social Science",
    "Computer Science",
  ],
  "2": [
    "Mathematics",
    "English",
    "Hindi",
    "Science",
    "Social Science",
    "Computer Science",
  ],
  "3": [
    "Mathematics",
    "English",
    "Hindi",
    "Science",
    "Social Science",
    "Computer Science",
  ],
  "4": [
    "Mathematics",
    "English",
    "Hindi",
    "Science",
    "Social Science",
    "Computer Science",
  ],
  "5": [
    "Mathematics",
    "English",
    "Hindi",
    "Science",
    "Social Science",
    "Computer Science",
  ],
  "6": [
    "Mathematics",
    "English",
    "Hindi",
    "Science",
    "Social Science",
    "Computer Science",
  ],
  "7": [
    "Mathematics",
    "English",
    "Hindi",
    "Science",
    "Social Science",
    "Computer Science",
  ],
  "8": [
    "Mathematics",
    "English",
    "Hindi",
    "Science",
    "Social Science",
    "Computer Science",
  ],
  "9": [
    "Mathematics",
    "English",
    "Hindi",
    "Science",
    "Social Science",
    "Computer Science",
  ],
  "10": [
    "Mathematics",
    "English",
    "Hindi",
    "Science",
    "Social Science",
    "Computer Science",
  ],
  "11": [
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
  "12": [
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
};

const FilterField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
      {label}
    </label>
    {children}
  </div>
);

const Mentors = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [mentorsData, setMentorsData] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);
  const [loader, setLoader] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 20000]);
  const [sortBy, setSortBy] = useState("rating");
  const [inPersonOnly, setInPersonOnly] = useState(false);
  const [teachingModeFilter, setTeachingModeFilter] = useState<"any" | "online" | "offline">("any");
  const [selectedState, setSelectedState] = useState<string | undefined>(
    undefined
  );
  const [selectedCity, setSelectedCity] = useState<string | undefined>(
    undefined
  );
  const [selectedArea, setSelectedArea] = useState<string | undefined>(
    undefined
  );
  const [selectedClass, setSelectedClass] = useState<string | undefined>(
    undefined
  );
  const [selectedLocation, setSelectedLocation] = useState("");

  const allStates = Object.keys(StateData);

  // Step 1: Get user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          console.log("User location:", lat, lon);
          setUserLocation({ lat, lon });
        },
        (error) => {
          console.warn("Geolocation error:", error);
          setUserLocation({ lat: 22.7196, lon: 75.8577 }); // Indore coordinates as fallback
        }
      );
    } else {
      console.warn("Geolocation not available");
      setUserLocation({ lat: 22.7196, lon: 75.8577 }); // Default location
    }
  }, []);
  const [locationName, setLocation] = useState<string>("your area");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const mapsKey = (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || "AIzaSyAb6ZthJEvNAczmOeuvFrnwEcMJjhlNpUk";
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${mapsKey}`
        );
        const data = await res.json();
        const components = data.results[0].address_components;

        const area = components.find(
          (c) =>
            c.types.includes("sublocality_level_1") ||
            c.types.includes("locality")
        )?.long_name;

        const city = components.find((c) =>
          c.types.includes("administrative_area_level_3")
        )?.long_name;

        console.log("components", components);
        setLocation(`${area}, ${city}`);
      },
      (error) => {
        setLocation("Location access denied");
      }
    );
  }, []);

  // Step 2: Once location is available, fetch mentors
  useEffect(() => {
    if (userLocation) {
      fetchMentors();
    }
  }, [userLocation]);

  // Step 3: Apply filters whenever mentorsData or filter states change
  useEffect(() => {
    applyFilters();
  }, [
    searchTerm,
    selectedSubject,
    priceRange,
    sortBy,
    selectedCity,
    selectedArea,
    selectedClass,
    teachingModeFilter,
  ]);

  const fetchMentors = async (params = {}) => {
    setLoader(true);
    try {
      console.log("Fetching mentors...");
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/mentor/visible-mentors`,
        { params }
      );
      console.log("API Response:", res.data);

      if (res.data) {
        const filteredAndSorted = filterAndSortMentors(
          res.data.mentors,
          userLocation
        );
        console.log("Processed mentors:", filteredAndSorted);
        setMentorsData(filteredAndSorted);
        setFilteredMentors(filteredAndSorted);
      } else {
        console.warn("No data found in API response");
        setMentorsData([]);
      }
    } catch (err) {
      console.error("Error fetching mentors:", err);
      setMentorsData([]);
    } finally {
      setLoader(false);
    }
  };
  const [goldMentors, setGoldMentors] = useState([]);
  const fetchGoldMentors = async () => {
    try {
      console.log("Fetching mentors...");
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/mentor/gold-mentor`
      );
      console.log("Gold Mentors", res.data.data)

      if (res.data && res.data.data) {
        setGoldMentors(res.data.data);
      } else {
        console.warn("No data found in API response");
        setGoldMentors([]);
      }
    } catch (err) {
      console.error("Error fetching mentors:", err);
      setGoldMentors([]);
    } finally {
    }
  };
  useEffect(() => {
    fetchGoldMentors();
  }, []);

  const getLatLonFromAddress = async (
    area: string,
    city: string,
    state: string,
    apiKey: string
  ) => {
    const address = `${area}, ${city}, ${state}, India`;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.status === "OK") {
      const location = data.results[0].geometry.location;
      console.log("Selected Area - ", location.lat, location.lng);
      setUserLocation({ lat: location.lat, lon: location.lng });
      return {
        lat: location.lat,
        lon: location.lng,
      };
    } else {
      throw new Error("Unable to get location for: " + address);
    }
  };
  useEffect(() => {
    if (selectedLocation) {
      getLatLonFromAddress(
        selectedLocation,
        selectedCity,
        selectedState,
        (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string) || "AIzaSyAb6ZthJEvNAczmOeuvFrnwEcMJjhlNpUk"
      );
    }
  }, [selectedLocation]);

  const filterAndSortMentors = (mentors, parentLocation) => {
    if (!mentors || !Array.isArray(mentors)) {
      console.warn("Invalid mentors data:", mentors);
      return [];
    }

    const withinRange = [];
    const outsideRange = [];

    mentors.forEach((mentor) => {
      try {
        const latitude = mentor.location?.lat || 0;
        const longitude = mentor.location?.lon || 0;

        const distance = getDistance(
          parentLocation.lat,
          parentLocation.lon,
          latitude,
          longitude
        );

        const range = parseTeachingRange(mentor.teachingRange);
        const mentorWithDistance = { ...mentor, distance };

        if (distance <= range) {
          withinRange.push(mentorWithDistance);
        } else {
          outsideRange.push(mentorWithDistance);
        }
      } catch (error) {
        console.warn("Error processing mentor:", mentor, error);
      }
    });

    const sortByRanking = (a, b) =>
      (a.adminRanking || 10) - (b.adminRanking || 10);

    const sortedWithin = withinRange.sort(sortByRanking);
    const sortedOutside = outsideRange.sort(sortByRanking);

    return [...sortedWithin, ...sortedOutside];
  };

  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function parseTeachingRange(rangeStr) {
    if (!rangeStr || rangeStr.toLowerCase() === "anywhere") return Infinity;
    const match = rangeStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }
  const [subjects, setSubjects] = useState<string[]>([]);
  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setSubjects(classSubjects[value] || []);
  };

  // Apply filters
  const applyFilters = () => {
    let result = [...mentorsData];
    let goldMentorList = [...goldMentors]
    // Filter by Class
    if (selectedClass && selectedSubject.length == 0) {
      result = result.filter((mentor) => {
        const schoolClasses = Object.keys(
          mentor?.teachingPreferences?.school || {}
        );
        return schoolClasses.some((key) => {
          const match = key.match(/\d+/g); // extract all numbers from keys like "class-9-10"
          if (!match) return false;
          const numbers = match.map(Number); // convert to [9, 10] or [12]
          // if the class is in a range like class-9-10, check if selectedClass is in range
          if (numbers.length === 2) {
            return +selectedClass >= numbers[0] && +selectedClass <= numbers[1];
          }
          // if single class like class-12
          return numbers[0] === +selectedClass;
        });
      });

      goldMentorList = goldMentorList.filter((mentor) => {
        const schoolClasses = Object.keys(
          mentor?.teachingPreferences?.school || {}
        );
        return schoolClasses.some((key) => {
          const match = key.match(/\d+/g); // extract all numbers from keys like "class-9-10"
          if (!match) return false;
          const numbers = match.map(Number); // convert to [9, 10] or [12]
          // if the class is in a range like class-9-10, check if selectedClass is in range
          if (numbers.length === 2) {
            return +selectedClass >= numbers[0] && +selectedClass <= numbers[1];
          }
          // if single class like class-12
          return numbers[0] === +selectedClass;
        });
      });
    }
    // Filter by search term
    if (searchTerm) {
      const terms = searchTerm.toLowerCase().trim().split(/\s+/);
      result = result.filter((mentor) => {
        const name = mentor.fullName?.toLowerCase() || "";
        const city = mentor.location?.city?.toLowerCase() || "";
        const area = mentor.location?.area?.toLowerCase() || "";
        const state = mentor.location?.state?.toLowerCase() || "";
        // Gather all subjects from all classes into a flat list
        const subjects = Object.values(
          mentor?.teachingPreferences?.school || {}
        )
          .flat()
          .map((subject) => subject.toLowerCase());
        // Also extract class keys to match class numbers like "9", "10", "12"
        const classKeys = Object.keys(
          mentor?.teachingPreferences?.school || {}
        ).map((key) => key.replace("class-", ""));

        return terms.some(
          (term) =>
            name.includes(term) ||
            city.includes(term) ||
            area.includes(term) ||
            state.includes(term) ||
            subjects.some((subj) => subj.includes(term)) ||
            classKeys.some((cls) => cls.includes(term))
        );
      });
    }

    // Filter by subject
    if (selectedSubject.length > 0) {
      result = result.filter((mentor) => {
        const schoolPrefs = mentor.teachingPreferences?.school;
        if (!schoolPrefs) return false;

        let subjectsForSelectedClass = [];

        // Loop through all class keys
        for (const [key, subjects] of Object.entries(schoolPrefs)) {
          const match = key.match(/\d+/g);
          if (!match) continue;

          const numbers = match.map(Number);
          const min = numbers[0];
          const max = numbers[1] || numbers[0];

          // Check if selectedClass falls within this range
          if (+selectedClass >= min && +selectedClass <= max) {
            subjectsForSelectedClass = subjects;
            break; // Found the matching class range, no need to check more
          }
        }

        // Check if all selected subjects are present in the found subjects
        return selectedSubject.every((subject) =>
          subjectsForSelectedClass.includes(subject)
        );
      });

      goldMentorList = goldMentorList.filter((mentor) => {
        const schoolPrefs = mentor.teachingPreferences?.school;
        if (!schoolPrefs) return false;
        let subjectsForSelectedClass = [];
        // Loop through all class keys
        for (const [key, subjects] of Object.entries(schoolPrefs)) {
          const match = key.match(/\d+/g);
          if (!match) continue;

          const numbers = match.map(Number);
          const min = numbers[0];
          const max = numbers[1] || numbers[0];

          // Check if selectedClass falls within this range
          if (+selectedClass >= min && +selectedClass <= max) {
            subjectsForSelectedClass = subjects;
            break; // Found the matching class range, no need to check more
          }
        }

        // Check if all selected subjects are present in the found subjects
        return selectedSubject.every((subject) =>
          subjectsForSelectedClass.includes(subject)
        );
      });
    }
    // Filter by city
    if (selectedCity) {
      result = result.filter(
        (mentor) =>
          mentor.location?.city?.toLowerCase() === selectedCity.toLowerCase()
      );
    }
    // Filter by area
    if (selectedLocation) {
      result = filterAndSortMentors(result, userLocation);
    }

    // --- Online / Offline mode filter ---
    if (teachingModeFilter !== "any") {
      result = result.filter((mentor) => {
        const m = mentor?.teachingMode || "offline";
        return m === teachingModeFilter || m === "both";
      });
      goldMentorList = goldMentorList.filter((mentor) => {
        const m = mentor?.teachingMode || "offline";
        return m === teachingModeFilter || m === "both";
      });
    }

    // --- ✅ New: Monthly Price Filter ---
    if (priceRange[1] != 20000) {
      result = result.filter((mentor) => {
        const price = parseInt(
          mentor?.teachingModes?.homeTuition?.monthlyPrice || "0",
          10
        );
        return (
          mentor?.teachingModes?.homeTuition?.selected &&
          price >= priceRange[0] &&
          price <= priceRange[1]
        );
      });
    }

    setGoldMentors(goldMentorList)
    setFilteredMentors(result);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSubject([]);
    setPriceRange([0, 20000]);
    setSortBy("rating");
    setInPersonOnly(false);
    setTeachingModeFilter("any");
    setSelectedCity(undefined);
    setSelectedState(undefined);
    setSelectedArea(undefined);
    setSelectedClass(undefined);
  };

  const handlePlaceSelect = () => {
    const autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById("autocomplete-input"),
      { types: ["(regions)"] }
    );
    autocomplete.setFields(["address_components", "formatted_address"]);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();

    });
  };

  useEffect(() => {
    handlePlaceSelect();
  }, []);

  const ref = useRef();
  const [visible, setVisible] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    const initializeAutocomplete = async () => {
      if (!selectedCity || !window.google || !inputRef.current) return;

      const fullAddress = `${selectedCity}, ${selectedState}, India`;
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
          }
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          console.log(place);
          setSelectedLocation(place["address_components"][3]?.long_name || "");
          setDetails(place);
        });
      } catch (error) {
        console.error("Error fetching geocode data:", error);
      }
    };
    initializeAutocomplete();
  }, [selectedCity]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);


  const activeFilterCount =
    (searchTerm ? 1 : 0) +
    (selectedSubject?.length || 0) +
    (selectedClass ? 1 : 0) +
    (selectedState ? 1 : 0) +
    (selectedCity ? 1 : 0) +
    ((priceRange[0] !== 0 || priceRange[1] !== 20000) ? 1 : 0);

  return (
    <Layout>
      <div className="min-h-screen bg-white pb-20">
        {/* Hero — dark mesh banner with prominent search */}
        <div className="relative isolate overflow-hidden bg-mesh-dark bg-mesh-animated noise-overlay text-white">
          <div aria-hidden className="absolute inset-0 dot-grid-dark opacity-50" />
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-14 md:pt-32 md:pb-20">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full bg-white/10 text-white border border-white/15 backdrop-blur">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Mentors near {locationName}
              </span>
              <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold tracking-tight leading-[1.05]">
                Find your next <span className="text-gradient-brand">home tutor</span>
              </h1>
              <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl">
                Verified, vetted, hand-picked. Free demo · 100% refund on the first session.
              </p>

              {/* Inline search hero */}
              <div className="mt-7 max-w-2xl">
                <div className="flex items-center bg-white rounded-2xl shadow-2xl shadow-blue-900/30 overflow-hidden">
                  <div className="pl-5 pr-2 text-slate-400">
                    <SearchIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by mentor name, subject or city…"
                    className="flex-1 h-14 bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none text-base"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="text-xs text-slate-500 hover:text-slate-700 px-3"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky results bar */}
        <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              <span className="text-2xl font-heading font-bold text-homentor-ink mr-2 align-middle">
                {filteredMentors.length}
              </span>
              <span className="align-middle">mentors</span>
              {activeFilterCount > 0 && (
                <span className="ml-3 align-middle inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-homentor-blue text-xs font-semibold">
                  <Filter className="w-3 h-3" />
                  {activeFilterCount} {activeFilterCount === 1 ? "filter" : "filters"} on
                </span>
              )}
            </p>
            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="text-sm font-medium text-homentor-blue hover:text-homentor-darkBlue"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Page body — sidebar filters + results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Filter sidebar */}
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-32 rounded-2xl bg-white border border-slate-200 shadow-sm p-5 space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                  <Filter className="w-4 h-4 text-homentor-blue" />
                  <p className="font-heading font-semibold text-homentor-ink">Filters</p>
                </div>

                <FilterField label="Class">
                  <ClassSelect
                    selectedSubjects={selectedClass}
                    handleClassChange={handleClassChange}
                  />
                </FilterField>

                <FilterField label="Subjects">
                  <MultiSubjectSelect
                    selectedSubjects={selectedSubject}
                    subjects={subjects}
                    setSelectedSubjects={setSelectedSubject}
                  />
                </FilterField>

                <FilterField label="State">
                  <StateSelect
                    selectedState={selectedState}
                    allStates={allStates}
                    setSelectedState={setSelectedState}
                  />
                </FilterField>

                <FilterField label="City">
                  <Select
                    disabled={!selectedState}
                    onValueChange={setSelectedCity}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={selectedState ? "Select city" : "Pick a state first"} />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedState &&
                        StateData[`${selectedState}`]?.map((city) => (
                          <SelectItem key={city} value={`${city}`}>
                            {city}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </FilterField>

                {selectedCity && (
                  <FilterField label={`Area in ${selectedCity}`}>
                    <input
                      ref={inputRef}
                      placeholder={`Type to search in ${selectedCity}`}
                      className="border border-slate-200 px-3 py-2 rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-homentor-blue/30"
                    />
                    {selectedLocation && (
                      <p className="text-xs text-slate-500 mt-1.5">
                        Selected: {selectedLocation}
                      </p>
                    )}
                  </FilterField>
                )}

                <FilterField label="Mode">
                  <Select
                    value={teachingModeFilter}
                    onValueChange={(v) =>
                      setTeachingModeFilter(v as "any" | "online" | "offline")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="online">Online</SelectItem>
                      <SelectItem value="offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                </FilterField>

                <FilterField label="Monthly fee">
                  <p className="text-xs text-slate-500 mb-2">
                    ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1].toLocaleString()}
                  </p>
                  <PriceSlider value={priceRange} onChange={setPriceRange} />
                </FilterField>
              </div>
            </aside>

            {/* Results */}
            <main className="lg:col-span-9 space-y-10">
              {/* Gold mentors strip */}
              {goldMentors.length > 0 && (
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-sm">
                      <Award className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-heading font-bold text-homentor-ink">
                        Gold Mentors
                      </h2>
                      <p className="text-xs text-slate-500">Premium · Top-rated educators</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                    {goldMentors.map((mentor) => (
                      <TornCard key={mentor._id || mentor.id} mentor={mentor} />
                    ))}
                  </div>
                </section>
              )}

              {/* All mentors */}
              <section>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-homentor-blue to-indigo-600 flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-heading font-bold text-homentor-ink">
                      All mentors
                    </h2>
                    <p className="text-xs text-slate-500">Verified educators across your area</p>
                  </div>
                </div>

                <SVGFilter />

                {loader ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded-2xl bg-white border border-slate-100 h-72 animate-pulse"
                      />
                    ))}
                  </div>
                ) : filteredMentors.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredMentors.map((mentor, index) => (
                      <TornCard
                        key={mentor._id || index}
                        mentor={mentor}
                      />
                    ))}
                  </div>
                ) : mentorsData.length === 0 ? (
                  <div className="text-center py-16 rounded-3xl bg-homentor-mist border border-slate-200">
                    <h3 className="text-lg font-heading font-semibold text-homentor-ink mb-2">
                      Unable to load mentors
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Please check your internet connection and try again.
                    </p>
                    <Button
                      className="bg-homentor-blue hover:bg-homentor-darkBlue"
                      onClick={fetchMentors}
                    >
                      Retry
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-16 rounded-3xl bg-homentor-mist border border-slate-200">
                    <h3 className="text-lg font-heading font-semibold text-homentor-ink mb-2">
                      No mentors match your filters
                    </h3>
                    <p className="text-slate-600 mb-4">
                      Try widening your search or clearing some filters.
                    </p>
                    <Button
                      className="bg-homentor-blue hover:bg-homentor-darkBlue"
                      onClick={resetFilters}
                    >
                      Clear filters
                    </Button>
                  </div>
                )}
              </section>
            </main>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Mentors;
