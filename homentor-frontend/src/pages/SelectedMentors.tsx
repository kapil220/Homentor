import React, { useState, useEffect, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
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
import AnimatedSelect from "@/components/AnimatedSelect";
import axios from "axios";
import StateData from "../StateData.json";
import { useLocation, useSearchParams } from "react-router-dom";

const classSubjects = {
  "1": ["English", "Math", "EVS", "Hindi"],
  "2": ["English", "Math", "EVS", "Hindi"],
  "3": ["English", "Math", "EVS", "Hindi"],
  "4": ["English", "Math", "Science", "Social Studies", "Hindi"],
  "5": ["English", "Math", "Science", "Social Studies", "Hindi"],
  "6": ["English", "Math", "Science", "Social Studies", "Hindi", "Sanskrit"],
  "7": ["English", "Math", "Science", "Social Studies", "Hindi", "Sanskrit"],
  "8": ["English", "Math", "Science", "Social Studies", "Hindi", "Sanskrit"],
  "9": [
    "English",
    "Mathematics",
    "Science",
    "Social Science",
    "Hindi",
    "Sanskrit",
  ],
  "10": [
    "English",
    "Mathematics",
    "Science",
    "Social Science",
    "Hindi",
    "Sanskrit",
  ],
  "11": [
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "Business Studies",
    "Accountancy",
    "Economics",
    "English",
  ],
  "12": [
    "Physics",
    "Chemistry",
    "Mathematics",
    "Biology",
    "Business Studies",
    "Accountancy",
    "Economics",
    "English",
  ],
};


const SelectedMentors = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const idParam = queryParams.get("id");
  const ids = idParam?.split(",") || [];
  const [mentorsData, setMentorsData] = useState([]);
  const [filteredMentors, setFilteredMentors] = useState([]);

  useEffect(() => {
    if (ids.length === 0) return;
    const fetchMentors = async () => {
      try {
        const res = await axios.get(
          `https://homentor-backend.onrender.com/api/mentor/selected-mentors?id=${ids.join(",")}`
        );
        console.log(res.data.mentors)
        setFilteredMentors(res.data.mentors);
      } catch (err) {
        console.error("Error fetching mentors:", err);
      } finally {
        // setLoading(false);
      }
    };
    fetchMentors();
  }, []);

  
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [loader, setLoader] = useState(false);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [sortBy, setSortBy] = useState("rating");
  const [inPersonOnly, setInPersonOnly] = useState(false);
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
  // useEffect(() => {
  //   if ("geolocation" in navigator) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         const lat = position.coords.latitude;
  //         const lon = position.coords.longitude;
  //         console.log("User location:", lat, lon);
  //         setUserLocation({ lat, lon });
  //       },
  //       (error) => {
  //         console.warn("Geolocation error:", error);
  //         setUserLocation({ lat: 22.7196, lon: 75.8577 }); // Indore coordinates as fallback
  //       }
  //     );
  //   } else {
  //     console.warn("Geolocation not available");
  //     setUserLocation({ lat: 22.7196, lon: 75.8577 }); // Default location
  //   }
  // }, []);
  const [locationName, setLocation] = useState<string>("your area");


  // Step 2: Once location is available, fetch mentors
  useEffect(() => {
    if (userLocation) {
      fetchMentors();
    }
  }, [userLocation]);

  // Step 3: Apply filters whenever mentorsData or filter states change
  // useEffect(() => {
  //   applyFilters();
  // }, [
  //   searchTerm,
  //   selectedSubject,
  //   priceRange,
  //   sortBy,
  //   selectedCity,
  //   selectedArea,
  //   selectedClass,
  // ]);

  const fetchMentors = async () => {
    setLoader(true);
    try {
      console.log("Fetching mentors...");
      const res = await axios.get(
        "https://homentor-backend.onrender.com/api/mentor"
      );
      console.log("API Response:", res.data);

      if (res.data && res.data.data) {
        const filteredAndSorted = filterAndSortMentors(
          res.data.data,
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
      setUserLocation({ lat: location.lat, lon: location.lat }); // Default location
      return {
        lat: location.lat,
        lon: location.lng,
      };
    } else {
      throw new Error("Unable to get location for: " + address);
    }
  };

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
    console.log(selectedSubject);
    // Filter by Class
    if (selectedClass) {
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
        // Safe check: teachingPreferences and school data exist
        const schoolPrefs = mentor.teachingPreferences?.school;

        if (!schoolPrefs) return false; // If no school preferences, skip this mentor
        // const allSubjects: string[] = [];
        let subLength = selectedSubject.length;
        const classWithSubjects = Object.entries(
          mentor.teachingPreferences?.school
        ).find((arr) => arr[0].includes(selectedClass));
        return selectedSubject.every((subject) => classWithSubjects[1].includes(subject));
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

    console.log(priceRange)
    console.log("Filtered mentors:", result);
    setFilteredMentors(result);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSubject([]);
    setPriceRange([0, 100]);
    setSortBy("rating");
    setInPersonOnly(false);
    setSelectedCity(undefined);
    setSelectedArea(undefined);
    setSelectedClass(undefined);
  };

  const [locationInput, setLocationInput] = useState("");
  const [locationDetails, setLocationDetails] = useState(null);

  const handlePlaceSelect = () => {
    const autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById("autocomplete-input"),
      { types: ["(regions)"] }
    );
    autocomplete.setFields(["address_components", "formatted_address"]);
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      setLocationInput(place.formatted_address);
      setLocationDetails(place);
    });
  };


  const ref = useRef();
  const [visible, setVisible] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    if (!selectedCity || !window.google || !inputRef.current) return;

    // Get coordinates of the selected city (you can use a fixed map or Geocoder API)
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
        strictBounds: true,
      }
    );

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      console.log(place);
      setSelectedLocation(place["address_components"][3].long_name || "");
      setDetails(place);
    });
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

  return (
    <Layout>
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xl text-center text-mentor-yellow-500 my-2 font-bold">
            Top Tutors's of {locationName}
          </p>

          <div className="space-y-3">
            <div className="flex gap-4 items-center">
              <SearchBar
                setSearchTerm={setSearchTerm}
                searchTerm={searchTerm}
              />

              <AnimatedSelect
                onValueChange={handleClassChange}
                placeholder="Select Class"
              >
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
                ].map((i) => (
                  <SelectItem value={`${i}`}>{`class ${i}`}</SelectItem>
                ))}
              </AnimatedSelect>

              <AnimatedSelect
                onValueChange={(value) => {
                  setSelectedSubject([...selectedSubject, value]);
                }}
                placeholder="Select Subject"
              >
                {subjects.map((subject) => (
                  <div className="flex">
                    <input
                      onChange={(e) => {
                        if (selectedSubject.includes(subject)) {
                          setSelectedSubject(
                            selectedSubject.filter(
                              (item) => item !== subject
                            )
                          );
                        } else {
                          setSelectedSubject([
                            ...selectedSubject,
                            subject,
                          ]);
                        }
                      }}
                      type="checkbox"
                      checked={selectedSubject.includes(subject)}
                    ></input>
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  </div>
                ))}
              </AnimatedSelect>
            </div>

            <div className="flex gap-4 items-center">
              <Select onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {allStates.map((state) => (
                    <SelectItem value={`${state}`}>{state}</SelectItem>
                  ))}
                  <SelectItem value="Palasia">Palasia</SelectItem>
                  <SelectItem value="Bhawarkuan">Bhawarkuan</SelectItem>
                </SelectContent>
              </Select>

              <Select
                disabled={!selectedState} // disable until a state is selected
                onValueChange={setSelectedCity}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select City" />
                </SelectTrigger>
                <SelectContent>
                  {selectedState &&
                    StateData[`${selectedState}`]?.map((city) => (
                      <SelectItem value={`${city}`}>{city}</SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                className="border-blue-500 text-blue-500 hover:bg-blue-50"
                onClick={resetFilters}
              >
                Reset
              </Button>
            </div>
            {selectedCity && (
              <div className="space-y-2">
                <label className="block font-medium text-sm">
                  Select Area in {selectedCity}
                </label>
                <input
                  ref={inputRef}
                  placeholder={`Type to search in ${selectedCity}`}
                  className="border px-3 py-2 rounded w-full"
                />
                {selectedLocation && (
                  <p className="text-xs text-gray-500">
                    Selected: {selectedLocation}
                  </p>
                )}
              </div>
            )}

            <div className="px-4 py-3 bg-white rounded-xl shadow-sm border mt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 font-medium">
                  ₹{priceRange[0]}
                </span>
                <Label className="text-sm font-semibold text-gray-800">
                  Price Range (₹/month)
                </Label>
                <span className="text-sm text-gray-700 font-medium">
                  ₹{priceRange[1]}
                </span>
              </div>

              <Slider
                value={priceRange}
                onValueChange={(value) =>
                  setPriceRange(value as [number, number])
                }
                min={0}
                max={10000}
                step={100}
                className="mt-4"
              />
            </div>
          </div>

          <div className="w-full mb-8">
            {/* <MentorCarousel mentors={filteredMentors} /> */}
          </div>

          <SVGFilter />

          <div className="mt-8">
            {loader ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-lg">Loading mentors...</div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMentors?.map((mentor, index) => (
                  <TornCard
                    key={mentor._id || mentor._id || index}
                    mentor={mentor}
                  />
                ))}
              </div>
            )}

            {!loader &&
              filteredMentors.length === 0 &&
              mentorsData.length > 0 && (
                <div className="text-center py-16">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No mentors found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search filters or reset them to see all
                    available mentors.
                  </p>
                  <Button
                    className="mt-4 bg-blue-600 hover:bg-blue-700"
                    onClick={resetFilters}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}

            {!loader && mentorsData.length === 0 && (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Unable to load mentors
                </h3>
                <p className="text-gray-600">
                  Please check your internet connection and try again.
                </p>
                <Button
                  className="mt-4 bg-blue-600 hover:bg-blue-700"
                  onClick={fetchMentors}
                >
                  Retry
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SelectedMentors;
