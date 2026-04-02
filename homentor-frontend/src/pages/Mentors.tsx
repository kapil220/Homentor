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
import { Award, Badge, Users } from "lucide-react";
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
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAb6ZthJEvNAczmOeuvFrnwEcMJjhlNpUk`
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
  ]);

  const fetchMentors = async (params = {}) => {
    setLoader(true);
    try {
      console.log("Fetching mentors...");
      const res = await axios.get(
        "https://homentor-backend.onrender.com/api/mentor/visible-mentors",
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
        "https://homentor-backend.onrender.com/api/mentor/gold-mentor"
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
      setUserLocation({ lat: location.lat, lon: location.lat }); // Default location
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
        "AIzaSyAb6ZthJEvNAczmOeuvFrnwEcMJjhlNpUk"
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

  const [showAllGold, setShowAllGold] = useState(false);

  return (
    <Layout>
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3">
            <div className="flex gap-4 items-center">
              {/* 1 */}
              <SearchBar
                setSearchTerm={setSearchTerm}
                searchTerm={searchTerm}
              />
              <Input
                className="hidden lg:block"
                placeholder="Enter Here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              ></Input>

              {/* Class */}
              <ClassSelect
                selectedSubjects={selectedClass}
                handleClassChange={handleClassChange}
              ></ClassSelect>

              {/* Subject */}
              <MultiSubjectSelect
                selectedSubjects={selectedSubject}
                subjects={subjects}
                setSelectedSubjects={setSelectedSubject}
              ></MultiSubjectSelect>
            </div>

            <div className="flex gap-4 items-center">
              <StateSelect
                selectedState={selectedState}
                allStates={allStates}
                setSelectedState={setSelectedState}
              ></StateSelect>

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
                  Fees Range (₹/month)
                </Label>
                <span className="text-sm text-gray-700 font-medium">
                  ₹{priceRange[1]}
                </span>
              </div>
              <PriceSlider value={priceRange} onChange={setPriceRange} />
            </div>

            <p className="text-xl text-center text-mentor-yellow-500 my-2 font-bold">
              Top Tutors's of {locationName}
            </p>
           

            <SVGFilter />
            <div className="mb-12 sm:mb-16">
              <div className="flex items-center justify-between mb-6 sm:mb-8 gap-3">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Award className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <h2 className="text-xl sm:text-3xl font-bold text-gray-900 truncate">
                    Gold Mentors
                  </h2>
                  <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs hidden sm:inline-flex">
                    Premium
                  </Badge>
                </div>
                <Button
                  onClick={() => setShowAllGold(true)}
                  variant="outline"
                  className="border-yellow-400 text-yellow-600 hover:bg-yellow-50 text-xs px-3 py-2 h-8 flex-shrink-0"
                >
                  <span className="">View More </span>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {goldMentors?.map(
                (mentor, index) =>
                  index <= 1 && (
                    <TornCard
                      key={mentor._id || mentor._id || index}
                      mentor={mentor}
                    />
                  )
              )}
            </div>
            <Dialog open={showAllGold} onOpenChange={setShowAllGold}>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto ">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl">
                    <Award className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" />
                    More Gold Mentors
                  </DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mt-6">
                  {goldMentors.map((mentor) => (
                    <TornCard key={mentor.id} mentor={mentor} />
                  ))}
                </div>
              </DialogContent>
            </Dialog>
            {/* Silver Mentors Section */}
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mt-6 sm:mb-8">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                </div>
                <h2 className="text-xl sm:text-3xl font-bold text-gray-900">Silver Mentors</h2>
                <Badge className="bg-gradient-to-r from-gray-400 to-gray-500 text-white text-xs hidden sm:inline-flex">
                  Standard
                </Badge>
              </div>
            </div>
            
            <div className="mt-8">
              {loader ? (
                <div className="flex justify-center items-center py-16">
                  <div className="text-lg">Loading mentors...</div>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
      </div>
    </Layout>
  );
};

export default Mentors;
