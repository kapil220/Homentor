import React, { useState, useEffect, useRef, Fragment } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Upload,
  Image,
  IdCard,
  Video,
  GraduationCap,
  MapPin,
  IndianRupee,
  BookOpen,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import axios from "axios";
import MonthlyRateSlider from "@/components/MonthlyRateSlider";
import { useNavigate } from "react-router-dom";
import StateData from "../StateData.json";
import PhoneNumberField from "@/components/ui/PhoneNumberField";
const graduationData = [
  // 🔬 Science
  { label: "B.Sc (Physics)", value: "bsc_physics" },
  { label: "B.Sc (Chemistry)", value: "bsc_chemistry" },
  { label: "B.Sc (Mathematics)", value: "bsc_mathematics" },
  { label: "B.Sc (Botany)", value: "bsc_botany" },
  { label: "B.Sc (Zoology)", value: "bsc_zoology" },
  { label: "B.Sc (Biotechnology)", value: "bsc_biotech" },
  { label: "B.Sc (Microbiology)", value: "bsc_microbiology" },
  { label: "B.Sc (Environmental Science)", value: "bsc_env_sci" },
  { label: "B.Sc (Computer Science)", value: "bsc_cs" },
  { label: "B.Sc (Statistics)", value: "bsc_statistics" },
  { label: "B.Tech (Computer Science)", value: "btech_cs" },
  { label: "B.Tech (Mechanical)", value: "btech_me" },
  { label: "B.Tech (Civil)", value: "btech_civil" },
  { label: "B.Tech (Electrical)", value: "btech_ee" },
  { label: "B.Tech (Electronics & Comm)", value: "btech_ec" },
  { label: "BCA (Computer Applications)", value: "bca" },
  { label: "B.Pharma (Pharmacy)", value: "bpharma" },
  { label: "B.Sc (Nursing)", value: "bsc_nursing" },

  // 💼 Commerce
  { label: "B.Com (General)", value: "bcom_general" },
  { label: "B.Com (Honours)", value: "bcom_hons" },
  { label: "B.Com (Accounting & Finance)", value: "bcom_af" },
  { label: "B.Com (Taxation)", value: "bcom_taxation" },
  { label: "B.Com (Banking & Insurance)", value: "bcom_bi" },
  { label: "BBA (Bachelor of Business Administration)", value: "bba" },
  { label: "BMS (Bachelor of Management Studies)", value: "bms" },
  { label: "BAF (Accounting & Finance)", value: "baf" },

  // 🎨 Arts / Humanities
  { label: "B.A. (English)", value: "ba_english" },
  { label: "B.A. (Hindi)", value: "ba_hindi" },
  { label: "B.A. (History)", value: "ba_history" },
  { label: "B.A. (Geography)", value: "ba_geography" },
  { label: "B.A. (Political Science)", value: "ba_political" },
  { label: "B.A. (Sociology)", value: "ba_sociology" },
  { label: "B.A. (Psychology)", value: "ba_psychology" },
  { label: "B.A. (Economics)", value: "ba_economics" },
  { label: "B.A. (Philosophy)", value: "ba_philosophy" },
  { label: "B.A. (Public Administration)", value: "ba_public_admin" },
  { label: "B.A. (Education)", value: "ba_education" },
  { label: "BJMC (Journalism & Mass Comm)", value: "bjmc" },
  { label: "BSW (Social Work)", value: "bsw" },
  { label: "BFA (Fine Arts)", value: "bfa" },

  // 🏫 Education & Others
  { label: "B.Ed (Education)", value: "bed" },
  { label: "B.El.Ed (Elementary Education)", value: "beled" },
  { label: "B.Li.Sc (Library Science)", value: "blisc" },
  { label: "B.Design (Interior/Fashion/Product)", value: "bdes" },
  { label: "B.Arch (Architecture)", value: "barch" },
  { label: "BHM (Hotel Management)", value: "bhm" },
  { label: "BPT (Physiotherapy)", value: "bpt" },
  { label: "LL.B (Law)", value: "llb" },
];

const TutorRegistrationForm = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [selectedLocation, setSelectedLocation] = useState("");

  const allStates = Object.keys(StateData);
  const [mentorData, setMentorData] = useState(() => ({
    // Personal Information
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    profilePhoto: null as File | null,
    mentorId: null as File | null,
    teachingVideo: null as File | null,
    cv: null as File | null,

    // Educational Background
    qualifications: {
      highestQualification: "",
      specialization: "",
      university: "",
      graduationYear: "",
    },
    twelfthStream: "", // new
    twelfthBoard: "",
    graduation: {
      degree: "",
      college: "",
    },
    postGraduation: {
      degree: "",
      college: "",
    },
    experience: "",

    // Location & Availability
    location: {
      area: "",
      city: "",
      state: "",
      lat: "",
      lon: "",
    },

    teachingRange: "",

    // Teaching Modes & Pricing
    teachingModes: [],

    // Teaching Preferences (Level -> Class -> Subject mapping)
    teachingPreferences: {} as Record<string, Record<string, string[]>>,

    // Availability
    availableDays: [] as string[],
    startDate: "",

    // Additional Information
    brief: "",
    teachingExperience: "",
  }));

  const getLatLonFromAddress = async (area: string, apiKey: string) => {
    const address = `${area}, ${mentorData.location.city}, ${mentorData.location.state}, India`;
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${apiKey}`
    );
    const data = await response.json();

    if (data.status === "OK") {
      const location = data.results[0].geometry.location;
      console.log("Selected Area - ", location.lat, location.lng);
      setMentorData({
        ...mentorData,
        location: {
          ...mentorData.location,
          lat: location.lat,
          lon: location.lat,
        },
      }); // Default location
      return {
        lat: location.lat,
        lon: location.lng,
      };
    } else {
      throw new Error("Unable to get location for: " + address);
    }
  };

  useEffect(() => {
    const initializeAutocomplete = async () => {
      if (!mentorData.location.city || !window.google || !inputRef.current)
        return;

      const fullAddress = `${mentorData.location.city}, ${mentorData.location.state}, India`;
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

        autocomplete.addListener("place_changed", async () => {
          const place = autocomplete.getPlace();
          console.log(place);
          setSelectedLocation(place["address_components"][2].long_name || "");
          const { lat, lon } = await getLatLonFromAddress(
            place["address_components"][2].long_name || "",
            "AIzaSyAb6ZthJEvNAczmOeuvFrnwEcMJjhlNpUk"
          );
          setMentorData({
            ...mentorData,
            location: {
              ...mentorData.location,
              area: place["address_components"][0].long_name || "",
              lat: lat,
              lon: lon,
            },
          });
        });
      } catch (error) {
        console.error("Error fetching geocode data:", error);
      }
    };
    initializeAutocomplete();
  }, [mentorData.location.city]);

  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [locationFetched, setLocationFetched] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({});
  const handleDetectLocation = () => {
    if ("geolocation" in navigator) {
      setLocationFetched(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const res = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=AIzaSyAb6ZthJEvNAczmOeuvFrnwEcMJjhlNpUk`
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

            const state = components.find((c) =>
              c.types.includes("administrative_area_level_1")
            )?.long_name;
            setMentorData({
              ...mentorData,
              location: {
                area: area,
                city: city,
                state: state,
                lat: lat,
                lon: lon,
              },
            });
            setCurrentLocation({
              area,
              city,
              state,
              lat,
              lon,
            });
            console.log(currentLocation);
          } catch (error) {
            console.warn("Geocoding error:", error);
          }
        },
        (error) => {
          console.warn("Geolocation error:", error);
        }
      );
    } else {
      console.warn("Geolocation not available");
    }
  };

  const updateFormData = (updates: Partial<typeof mentorData>) => {
    setMentorData((prev) => ({ ...prev, ...updates }));
  };

  const handleLocation = (key, value) => {
    setMentorData({
      ...mentorData,
      location: {
        ...mentorData.location,
        [key]: value,
      },
    });
  };
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = () => {
    if (!validateForm()) {
      // Scroll to the first error
      const firstError = document.querySelector(".border-red-500");
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }
    setIsLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_URL}/api/mentor`, mentorData)
      .then((res) => {
        console.log("Form submitted:", mentorData);
        setShowThankYouModal(true); // ✅ Show thank-you modal
        setIsLoading(false);
      })
      .catch((err) => {console.log(err); setIsLoading(false); alert("Submission failed. Please try again.");});
  };

  const teachingModeOptions = [
    {
      id: "homeTuition",
      label: "Home Tuition (Student's Home)",
      description: "Visit student's home for teaching",
    },
    {
      id: "myPlace",
      label: "My Place",
      description: "Students come to your location",
    },

    {
      id: "groupClasses",
      label: "Group Classes",
      description: "Small group batch teaching",
    },
  ];

  // Handler functions
  const handleTeachingModeChange = (
    modeId: string,
    field: "selected" | "monthlyPrice",
    value: boolean | string
  ) => {
    updateFormData({
      teachingModes: {
        ...mentorData.teachingModes,
        [modeId]: {
          ...mentorData.teachingModes[modeId],
          [field]: value,
        },
      },
    });
  };

  // ---------------------------Image/Video Upload------------------------------
  const [uploadingKey, setUploadingKey] = useState(null);
  const handleImageUpload = async (e, key) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingKey(key);
    const isVideo = file.type.startsWith("video/");
    const uploadUrl = `https://api.cloudinary.com/v1_1/dpveehhtq/${
      isVideo ? "video" : "image"
    }/upload`;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "homentor"); // change this
    formData.append("cloud_name", "dpveehhtq"); // change this

    // setUploading(true);
    try {
      const res = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log(key);
      setMentorData({ ...mentorData, [key]: data.secure_url });
    } catch (err) {
      alert("Upload failed");
      console.error(err);
    } finally {
      setUploadingKey("");
    }
  };

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
  const isChecked = (levelId, classId, subject) => {
    return (
      mentorData.teachingPreferences[levelId]?.[classId]?.includes(subject) ??
      false
    );
  };
  const toggleSubject = (
    classId: string,
    subject: string,
    checked: boolean
  ) => {
    setMentorData((prev) => {
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
  const toggleAllForClass = (levelId, classId, checked) => {
    setMentorData((prev) => ({
      ...prev,
      teachingPreferences: {
        ...prev.teachingPreferences,
        [levelId]: {
          ...prev.teachingPreferences[levelId],
          [classId]: checked ? [...juniorMatrix.subjects] : [],
        },
      },
    }));
  };
  // Select subject across ALL classes
  const toggleAllForSubject = (levelId, subject, checked) => {
    setMentorData((prev) => {
      const updatedClasses = {};

      juniorMatrix.classes.forEach((cls) => {
        updatedClasses[cls.id] = checked
          ? [
              ...new Set([
                ...(prev.teachingPreferences[levelId]?.[cls.id] || []),
                subject,
              ]),
            ]
          : (prev.teachingPreferences[levelId]?.[cls.id] || []).filter(
              (s) => s !== subject
            );
      });

      return {
        ...prev,
        teachingPreferences: {
          ...prev.teachingPreferences,
          [levelId]: {
            ...prev.teachingPreferences[levelId],
            ...updatedClasses,
          },
        },
      };
    });
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
  const isRowAllChecked = (classId, subjects) =>
    subjects.every((s) => isChecked("school", classId, s));

  const toggleRowAll = (classId, subjects, checked) => {
    setMentorData((prev) => {
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
  // Add this state at the top of your component
  const [formErrors, setFormErrors] = useState({
    fullName: "",
    phone: "",
    location: {
      state: "",
      city: "",
      area: "",
    },
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: "",
      phone: "",
      location: {
        state: "",
        city: "",
        area: "",
      },
    };

    // Name validation
    if (!mentorData.fullName?.trim()) {
      newErrors.fullName = "Name is required";
      isValid = false;
    }

    // Phone validation (already handled in PhoneNumberField)
    if (!mentorData.phone) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    }

    // Location validation
    if (!mentorData.location.state) {
      newErrors.location.state = "State is required";
      isValid = false;
    }
    if (!mentorData.location.city) {
      newErrors.location.city = "City is required";
      isValid = false;
    }
    if (!mentorData.location.area) {
      newErrors.location.area = "Area is required";
      isValid = false;
    }
    setFormErrors(newErrors);
    return isValid;
  };

  console.log(mentorData);
  const fetchDegrees = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/degrees`);
    setCollegeMatrix({ degrees: res.data.data });
  };
  useEffect(()=>{fetchDegrees()}, [])
  const [openCollege, setOpenCollege] = useState(false);
  const toggleCollegeSubject = (degreeId, subject, checked) => {
    setMentorData((prev) => {
      const existing = prev.teachingPreferences.other?.[degreeId] || [];

      const updatedSubjects = checked
        ? [...new Set([...existing, subject])]
        : existing.filter((s) => s !== subject);

      return {
        ...prev,
        teachingPreferences: {
          ...prev.teachingPreferences,
          other: {
            ...prev.teachingPreferences.other,
            [degreeId]: updatedSubjects,
          },
        },
      };
    });
  };

  const [collegeMatrix, setCollegeMatrix] = useState({
    degrees: [
      {
        id: "bcom",
        label: "B.Com",
        subjects: ["Accounting", "Business Law", "Economics", "Taxation"],
      },
      {
        id: "bba",
        label: "BBA",
        subjects: ["Management", "Marketing", "HR", "Finance"],
      },
      {
        id: "bsc",
        label: "B.Sc",
        subjects: ["Physics", "Chemistry", "Maths", "Biology"],
      },
      {
        id: "mba",
        label: "MBA",
        subjects: ["Strategy", "HR", "Finance", "Operations"],
      },
      {
        id: "mca",
        label: "MCA",
        subjects: ["DSA", "DBMS", "Java", "Web Dev"],
      },
    ],
  });
  const toggleAllForDegree = (degreeId, checked) => {
    setMentorData((prev) => {
      const degree = collegeMatrix.degrees.find((d) => d.id === degreeId);

      if (!degree) return prev;

      return {
        ...prev,

        teachingPreferences: {
          ...prev.teachingPreferences,

          other: {
            ...prev.teachingPreferences?.other,

            [degreeId]: checked
              ? [...degree.subjects] // select all
              : [], // unselect all
          },
        },
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  from-mentor-blue-50 via-white to-mentor-yellow-50 py-8 lg:px-4 px-2">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-mentor-blue-600 to-mentor-yellow-500 bg-clip-text text-transparent mb-4">
            Join HomeMentor
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Become a part of our elite tutoring network and help students
            achieve their academic goals through personalized offline coaching.
          </p>
        </div>

        <div className="space-y-8">
          {/* Personal Information */}
          <Card className="border-mentor-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-mentor-blue-500 to-mentor-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-mentor-blue-100">
                Please provide your basic details and required documents
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={mentorData.fullName}
                    onChange={(e) => {
                      updateFormData({ fullName: e.target.value });
                      if (formErrors.fullName) {
                        setFormErrors((prev) => ({ ...prev, fullName: "" }));
                      }
                    }}
                    className={`focus:ring-mentor-yellow-400 focus:border-mentor-yellow-400 ${
                      formErrors.fullName ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {formErrors.fullName && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.fullName}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <PhoneNumberField
                  mentorData={mentorData}
                  updateFormData={updateFormData}
                />
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={mentorData.gender}
                    onValueChange={(value) => updateFormData({ gender: value })}
                  >
                    <SelectTrigger className="focus:ring-mentor-yellow-400 focus:border-mentor-yellow-400">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium mb-4 text-mentor-blue-700">
                  Required Documents & Media
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Profile Photo */}
                  <div>
                    <Label
                      htmlFor="photo"
                      className="flex items-center gap-2 mb-2"
                    >
                      <Image className="h-4 w-4" />
                      Profile Photo *
                    </Label>
                    <div className="relative">
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "profilePhoto")}
                        className="hidden"
                      />
                      <label
                        htmlFor="photo"
                        className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-mentor-yellow-400 bg-gray-50 hover:bg-mentor-yellow-50 transition-colors"
                      >
                        {uploadingKey === "profilePhoto" ? (
                          <div className="flex flex-col items-center justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-mentor-yellow-500" />
                            <p className="text-sm text-gray-600 mt-2">
                              Uploading...
                            </p>
                          </div>
                        ) : mentorData?.profilePhoto ? (
                          <img
                            src={mentorData?.profilePhoto}
                            controls
                            className="h-full w-auto object-contain rounded"
                          />
                        ) : (
                          <div className="text-center">
                            <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                            <p className="text-sm text-gray-600">
                              Click to upload photo
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-mentor-yellow-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-mentor-yellow-500 to-mentor-yellow-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Educational Background
              </CardTitle>
              <CardDescription className="text-mentor-yellow-100">
                Your academic qualifications
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Graduation Details */}
              <div className="space-y-2">
                <h4 className="font-semibold text-lg text-mentor-yellow-600">
                  Graduation
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="graduation-degree">Course/Degree*</Label>
                    <Select
                      value={mentorData.graduation.degree}
                      onValueChange={(value) =>
                        setMentorData({
                          ...mentorData,
                          graduation: {
                            ...mentorData.graduation,
                            degree: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        {graduationData.map((i, index) => (
                          <SelectItem key={index} value={i.label}>
                            {i.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="experience">Teaching Experience *</Label>
                <Select
                  value={mentorData.experience}
                  onValueChange={(value) =>
                    updateFormData({ experience: value })
                  }
                >
                  <SelectTrigger className="mt-1 focus:ring-mentor-blue-400 focus:border-mentor-blue-400">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-mentor-yellow-200">
                    <SelectItem value="fresher">Fresher</SelectItem>
                    <SelectItem value="1-3">1-3 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Location & Availability Range */}
          <Card className="border-mentor-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-mentor-blue-500 to-mentor-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location & Availability Range
              </CardTitle>
              <CardDescription className="text-mentor-blue-100">
                Where are you located and what's your teaching range?
              </CardDescription>
            </CardHeader>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDetectLocation()}
              className="w-full"
            >
              📍 Detect My Location
            </Button>

            <CardContent className="p-6 space-y-4">
              <div className="space-y-6">
                {/* State */}
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Select
                    onValueChange={(value) => {
                      handleLocation("state", value);
                      if (formErrors.location.state) {
                        setFormErrors((prev) => ({
                          ...prev,
                          location: { ...prev.location, state: "" },
                        }));
                      }
                    }}
                    value={mentorData.location.state}
                  >
                    <SelectTrigger
                      className={
                        formErrors.location.state ? "border-red-500" : ""
                      }
                    >
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {allStates.map((state) => (
                        <SelectItem key={state} value={`${state}`}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.location.state && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.location.state}
                    </p>
                  )}
                </div>

                {/* City */}
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Select
                    disabled={!mentorData.location.state} // disable until a state is selected
                    onValueChange={(value) => {
                      handleLocation("city", value);
                      if (formErrors.location.city) {
                        setFormErrors((prev) => ({
                          ...prev,
                          location: { ...prev.location, city: "" },
                        }));
                      }
                    }}
                    value={mentorData.location.city}
                  >
                    <SelectTrigger
                      className={`${
                        formErrors.location.city ? "border-red-500" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select City" />
                    </SelectTrigger>
                    <SelectContent>
                      {mentorData.location.state &&
                        StateData[`${mentorData.location.state}`]?.map(
                          (city, index) => (
                            <SelectItem key={index} value={`${city}`}>
                              {city}
                            </SelectItem>
                          )
                        )}
                    </SelectContent>
                  </Select>
                  {formErrors.location.city && (
                    <p className="text-xs text-red-500 mt-1">
                      {formErrors.location.city}
                    </p>
                  )}
                </div>

                {/* Area */}
                <div>
                  <Label htmlFor="area">Area *</Label>
                  <div className="space-y-2">
                    {!locationFetched ? (
                      <input
                        // value={mentorData.location.area}
                        ref={inputRef}
                        placeholder={`Type to search in ${mentorData.location.city}`}
                        className={`border px-3 py-2 rounded w-full ${
                          formErrors.location.area ? "border-red-500" : ""
                        }`}
                      />
                    ) : (
                      <input
                        className={`border px-3 py-2 rounded w-full ${
                          formErrors.location.area ? "border-red-500" : ""
                        }`}
                        value={mentorData.location.area}
                      ></input>
                    )}
                    {formErrors.location.area && (
                      <p className="text-xs text-red-500 mt-1">
                        {formErrors.location.area}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="availabilityRange">
                  Teaching Availability Range *
                </Label>
                <Select
                  value={mentorData.teachingRange}
                  onValueChange={(value) =>
                    updateFormData({ teachingRange: value })
                  }
                >
                  <SelectTrigger className="mt-1 focus:ring-mentor-yellow-400 focus:border-mentor-yellow-400">
                    <SelectValue placeholder="Select your travel range" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-mentor-blue-200">
                    <SelectItem value="2km">Within 2 km</SelectItem>
                    <SelectItem value="5km">Within 5 km</SelectItem>
                    <SelectItem value="10km">Within 10 km</SelectItem>
                    <SelectItem value="15km">Within 15 km</SelectItem>
                    <SelectItem value="20km">Within 20 km</SelectItem>
                    <SelectItem value="25km+">25+ km</SelectItem>
                    <SelectItem value="anywhere">Anywhere in city</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Teaching Modes & Monthly Pricing */}
          <Card className="border-mentor-yellow-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-mentor-yellow-500 to-mentor-yellow-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Teaching Modes & Monthly Pricing
              </CardTitle>
              <CardDescription className="text-mentor-yellow-100">
                Select your preferred teaching modes and set monthly rates
              </CardDescription>
            </CardHeader>
            <CardContent className="lg:p-6 py-2 px-2 lg:px-4 lg:space-y-6 space-y-2">
              {teachingModeOptions.map((mode) => (
                <div
                  key={mode.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id={`mode-${mode.id}`}
                      checked={
                        mentorData.teachingModes[mode.id]?.selected || false
                      }
                      onCheckedChange={(checked) =>
                        handleTeachingModeChange(
                          mode.id,
                          "selected",
                          checked as boolean
                        )
                      }
                      className="mt-1 data-[state=checked]:bg-mentor-blue-500 data-[state=checked]:border-mentor-blue-500"
                    />
                    <div className="flex-1">
                      <Label
                        htmlFor={`mode-${mode.id}`}
                        className="text-base font-medium cursor-pointer"
                      >
                        {mode.label}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">
                        {mode.description}
                      </p>
                      {mentorData.teachingModes[mode.id]?.selected && (
                        <div className="mt-3">
                          <MonthlyRateSlider
                            className="px-0"
                            value={
                              mentorData.teachingModes[mode.id]?.monthlyPrice ||
                              3000
                            }
                            onValueChange={(value) =>
                              handleTeachingModeChange(
                                mode.id,
                                "monthlyPrice",
                                value
                              )
                            }
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Teaching Preferences - Hierarchical Selection */}
          <Card className="border-mentor-blue-200 shadow-lg ">
            <CardHeader className="bg-gradient-to-r from-mentor-blue-500 to-mentor-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Teaching Preferences
              </CardTitle>
              <CardDescription className="text-mentor-blue-100">
                Select education levels, then classes/courses, and finally
                subjects you can teach
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6 px-2 lg:px-4  space-y-4">
              <div className="border rounded-lg overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left font-semibold">Subjects</th>

                      {juniorMatrix.classes.map((cls) => {
                        const allSelected = juniorMatrix.subjects.every(
                          (subject) => isChecked("school", cls.id, subject)
                        );

                        return (
                          <th key={cls.id} className="p-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="font-medium">{cls.label}</span>
                              <div className="flex items-center gap-1 text-xs">
                                <Checkbox
                                  checked={allSelected}
                                  onCheckedChange={(checked) =>
                                    toggleAllForClass(
                                      "school",
                                      cls.id,
                                      checked as boolean
                                    )
                                  }
                                />
                                <span>All</span>
                              </div>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody>
                    {juniorMatrix.subjects.map((subject) => {
                      const subjectAllChecked = juniorMatrix.classes.every(
                        (cls) => isChecked("school", cls.id, subject)
                      );

                      return (
                        <tr key={subject} className="border-t hover:bg-gray-50">
                          <td className="p-3 font-medium">
                            <div className="flex items-center gap-2">
                              <Checkbox
                                checked={subjectAllChecked}
                                onCheckedChange={(checked) =>
                                  toggleAllForSubject(
                                    "school",
                                    subject,
                                    checked as boolean
                                  )
                                }
                              />
                              <span>{subject}</span>
                            </div>
                          </td>

                          {juniorMatrix.classes.map((cls) => (
                            <td key={cls.id} className="p-3 text-center">
                              <Checkbox
                                checked={isChecked("school", cls.id, subject)}
                                onCheckedChange={(checked) =>
                                  toggleSubject(
                                    
                                    cls.id,
                                    subject,
                                    checked as boolean
                                  )
                                }
                                className="data-[state=checked]:bg-mentor-yellow-500 data-[state=checked]:border-mentor-yellow-500"
                              />
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="border rounded-lg overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  {/* Header */}
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left w-[260px]">Subjects</th>
                      <th className="p-3 text-center">Class 11</th>
                      <th className="p-3 text-center">Class 12</th>
                    </tr>
                  </thead>

                  <tbody>
                    {seniorMatrix.subjects.map((group, index) => (
                      <>
                        <tr key={index}>
                          <td className="bg-blue-50 px-3 py-2 font-semibold text-blue-700">
                            <div className="flex items-center gap-3">
                              {group.label}
                            </div>
                          </td>

                          <td className="bg-blue-50 px-3 py-2 font-semibold text-blue-700">
                            <Checkbox
                              checked={isRowAllChecked("class-11", group.items)}
                              onCheckedChange={(checked) =>
                                toggleRowAll(
                                  "class-11",
                                  group.items,
                                  checked as boolean
                                )
                              }
                            />
                          </td>

                          <td className="bg-blue-50 px-3 py-2 font-semibold text-blue-700">
                            <Checkbox
                              checked={isRowAllChecked("class-12", group.items)}
                              onCheckedChange={(checked) =>
                                toggleRowAll(
                                  "class-12",
                                  group.items,
                                  checked as boolean
                                )
                              }
                            />
                          </td>
                        </tr>
                        {group.items.map((subject) => (
                          <tr key={subject} className="border-t">
                            <td className="p-3 font-medium">{subject}</td>
                            {seniorMatrix.classes.map((cls) => (
                              <td key={cls.id} className="text-center p-3">
                                <Checkbox
                                  checked={isChecked("school", cls.id, subject)}
                                  onCheckedChange={(checked) =>
                                    toggleSubject(
                                      cls.id,
                                      subject,
                                      checked as boolean
                                    )
                                  }
                                  className="data-[state=checked]:bg-mentor-yellow-500 
                         data-[state=checked]:border-mentor-yellow-500"
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                        </>
                      
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            {/* 🎓 College / Degree Section */}
            <div className="border rounded-xl overflow-hidden">
              {/* Header */}
              <button
                type="button"
                onClick={() => setOpenCollege(!openCollege)}
                className="w-full flex items-center justify-between
               px-4 py-3 bg-gradient-to-r
               from-purple-500 to-purple-600
               text-white font-semibold"
              >
                <span>Other Courses</span>

                <span className="text-lg">{openCollege ? "−" : "+"}</span>
              </button>

              {/* Content */}
              {openCollege && (
                <div className="p-4 bg-gray-50 space-y-4">
                  {collegeMatrix.degrees.map((deg) => {
                    const allChecked = deg.subjects.every((sub) =>
                      isChecked("other", deg.id, sub)
                    );

                    return (
                      <div
                        key={deg._id}
                        className="bg-white rounded-lg border shadow-sm"
                      >
                        {/* Degree Header */}
                        <div className="flex items-center justify-between px-4 py-2 bg-purple-50">
                          <span className="font-semibold text-purple-700">
                            {deg.name}
                          </span>

                          <div className="flex items-center gap-2 text-sm">
                            <Checkbox
                              checked={allChecked}
                              onCheckedChange={(checked) =>
                                toggleAllForDegree(
                                  deg.name,
                                  checked as boolean
                                )
                              }
                            />
                            <span>Select All</span>
                          </div>
                        </div>

                        {/* Subjects */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
                          {deg.subjects.map((subject) => (
                            <label
                              key={subject}
                              className="flex items-center gap-2 text-sm cursor-pointer"
                            >
                              <Checkbox
                                checked={isChecked("other", deg.name, subject)}
                                onCheckedChange={(checked) =>
                                  toggleCollegeSubject(
                                    deg.name,
                                    subject,
                                    checked as boolean
                                  )
                                }
                                className="data-[state=checked]:bg-mentor-yellow-500 
                               data-[state=checked]:border-mentor-yellow-500"
                              />

                              <span>{subject}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </Card>

          {/* Teaching Experience - Simplified */}
          <Card className="border-mentor-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-mentor-blue-500 to-mentor-blue-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Teaching Details
              </CardTitle>
              <CardDescription className="text-mentor-blue-100">
                Brief description of your teaching approach
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div>
                <Label htmlFor="brief">Bio</Label>
                <Textarea
                  id="brief"
                  placeholder="Briefly describe yourself..."
                  value={mentorData.brief}
                  onChange={(e) => updateFormData({ brief: e.target.value })}
                  className="mt-1 min-h-[80px] focus:ring-mentor-yellow-400 focus:border-mentor-yellow-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              onClick={() => handleSubmit()}
              size="lg"
              className="bg-gradient-to-r from-mentor-blue-600 to-mentor-yellow-500 hover:from-mentor-blue-700 hover:to-mentor-yellow-600 text-white px-12 py-3 text-lg font-semibold rounded-lg shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              By submitting this form, you agree to our terms and conditions and
              privacy policy.
            </p>
          </div>
          {showThankYouModal && (
            <div className="h-[100vh] w-[100%] fixed top-[-5%] left-0 z-[1000] flex items-center justify-center">
              <div className="h-[100vh] w-[100%] top-0 left-0 bg-black opacity-50 fixed"></div>
              <div className="bg-white z-[50] w-[90%] relative h-auto px-2 py-4 rounded-sm">
                <p className="text-center text-lg text-gray-700 ">
                  Your application has been submitted successfully. We’ll
                  contact you soon.
                </p>
                <div className="text-center ">
                  <Button
                    onClick={() => {
                      setShowThankYouModal(false);
                      navigate("/"); // ✅ On "Okay" click
                    }}
                    className="mt-4"
                  >
                    Okay
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TutorRegistrationForm;
