import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Calendar,
  Award,
  MessageCircle,
  Video,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Quote,
  GraduationCap,
  Home,
  PhoneCall,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import Layout from "@/components/Layout"; 
import axios from "axios";
import LoginPopup from "@/components/LoginPopup";
import BookingCard from "@/comp/BookingCard";
import { createOrder } from "@/api/payment.jsx";
import { load } from "@cashfreepayments/cashfree-js";

// Mock teacher data for homentor platform
const teacherData = {
  id: 1,
  name: "Sarah Johnson",
  title: "Mathematics & Science Teacher",
  qualification: "M.Ed Mathematics, B.Sc Physics",
  location: "Downtown Area, City Center",
  avatar: "/placeholder.svg",
  rating: 4.9,
  totalReviews: 127,
  totalStudents: 450,
  yearsExperience: 8,
  responseTime: "< 2 hours",
  languages: ["English", "Hindi", "Spanish"],
  hourlyRate: 25,
  bio: "Passionate educator with 8+ years of experience teaching mathematics and science to school students. I specialize in making complex concepts simple and helping students excel in their academics through personalized home tutoring sessions.",
  subjects: [
    "Mathematics (Grades 6-12)",
    "Physics (Grades 9-12)",
    "Chemistry (Grades 9-10)",
    "Science (Grades 6-8)",
    "Algebra",
    "Geometry",
    "Calculus",
    "Exam Preparation",
  ],
  teachingAreas: [
    "Home Tutoring",
    "Exam Preparation",
    "Homework Help",
    "Concept Clearing",
    "Assignment Support",
    "Board Exam Coaching",
  ],
  experience: [
    {
      school: "Greenfield High School",
      role: "Senior Mathematics Teacher",
      duration: "2020 - Present",
      description:
        "Teaching advanced mathematics to grades 9-12, with 95% student pass rate in board exams.",
    },
    {
      school: "Riverside Academy",
      role: "Science Teacher",
      duration: "2018 - 2020",
      description:
        "Taught physics and chemistry to middle and high school students with innovative teaching methods.",
    },
    {
      school: "Home Tutoring (Independent)",
      role: "Private Tutor",
      duration: "2016 - Present",
      description:
        "Providing personalized home tutoring to 50+ students with average grade improvement of 2 levels.",
    },
  ],
  education: [
    {
      degree: "M.Ed in Mathematics Education",
      school: "State University",
      year: "2016",
    },
    {
      degree: "B.Sc in Physics",
      school: "City College",
      year: "2014",
    },
  ],
  achievements: [
    "Best Teacher Award 2023",
    "100% Board Exam Pass Rate",
    "Student Choice Award 2022",
    "Excellence in Home Tutoring",
  ],
  reviews: [
    {
      id: 1,
      name: "Priya Sharma",
      avatar: "/placeholder.svg",
      rating: 5,
      date: "2 weeks ago",
      comment:
        "Sarah ma'am helped my daughter improve from C grade to A+ in mathematics. Her home tutoring sessions are excellent and very convenient for busy parents like us.",
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      avatar: "/placeholder.svg",
      rating: 5,
      date: "1 month ago",
      comment:
        "Fantastic teacher! My son's physics concepts became so clear after Sarah's tutoring sessions. She comes to our home and teaches with great patience.",
    },
    {
      id: 3,
      name: "Anita Patel",
      avatar: "/placeholder.svg",
      rating: 5,
      date: "2 months ago",
      comment:
        "Best decision to hire Sarah for my child's mathematics tutoring. Her teaching style is amazing and my child now loves math!",
    },
  ],
  availability: [
    { day: "Monday", times: ["4:00 PM", "6:00 PM", "7:30 PM"] },
    { day: "Tuesday", times: ["5:00 PM", "7:00 PM"] },
    { day: "Wednesday", times: ["4:00 PM", "6:30 PM", "8:00 PM"] },
    { day: "Thursday", times: ["5:30 PM", "7:30 PM"] },
    { day: "Friday", times: ["4:00 PM", "6:00 PM"] },
    { day: "Saturday", times: ["10:00 AM", "2:00 PM", "4:00 PM"] },
    { day: "Sunday", times: ["10:00 AM", "3:00 PM"] },
  ],
};

const MentorDetails = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    (getAdminData(), []);
  });
  const mentorData = JSON.parse(localStorage.getItem("mentorDetail"));
  const [bookingAmount, setBookingAmount] = useState(0);
  const [isPayment, setIsPayment] = useState(false);

  const subjects = [
    ...new Set(
      Object.values(mentorData?.teachingPreferences?.school || {}).flat(),
    ),
  ];
  const prioritySubjects = ["Mathematics", "Science", "Social Science"];
  // Sort subjects: priority ones come first, rest follow
  const sortedSubjects = [
    ...prioritySubjects.filter((s) => subjects?.includes(s)),
    ...subjects?.filter((s) => !prioritySubjects.includes(s)),
  ];

  const [activeTab, setActiveTab] = useState("overview");
  console.log(mentorData);

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const userNumber = localStorage.getItem("usernumber");

  const payNow = async (fees, duration) => {
    if (!userNumber) {
      setBookingAmount(fees);
      setIsLoginOpen(true);
      return;
    }
    try {
      const data = await createOrder({
        amount: Math.round(fees),
        customerId: `homentor${Date.now()}`,
        customerPhone: userNumber,
        mentorId: mentorData._id,
        duration: duration
      });
      localStorage.setItem("orderId", data.order_id);
      
      let cashfree = await load({
        mode: "production",
      });
      console.log(cashfree);

      let checkoutOptions = {
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_self",
      };
      cashfree.checkout(checkoutOptions);
    } catch (error) {
      alert("Failed to initiate payment");
    }
  };

  useEffect(() => {
    if (userNumber && isPayment) {
      console.log("userNumber", userNumber);
      payNow(bookingAmount);
    }
  }, [isPayment]);
  const targetDivRef = useRef(null);
  const handleScroll = () => {
    targetDivRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const [callingNo, setCallingNo] = useState("");
  const getAdminData = () => {
    axios.get("https://homentor-backend.onrender.com/api/admin").then((res) => {
      setCallingNo(res.data.data[0].callingNo);
    });
  };
  const sendCallRequest = () => {
    axios
      .post("https://homentor-backend.onrender.com/api/mentor-call", {
        name: mentorData?.fullName,
        phone: mentorData?.phone,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };
  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 mt-[7vh]">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-8">
          {/* Teacher Header Section */}
          <Card className="mb-8 overflow-hidden shadow-xl border-0">
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 h-32 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-yellow-500/20"></div>
            </div>
            <CardContent className="lg:p-8 p-4 -mt-16 relative bg-white">
              <div className="flex flex-col lg:flex-row items-start gap-6">
                <div className="flex justify-between lg:w-auto w-[100%]">
                  <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                    <AvatarImage
                      src={mentorData?.profilePhoto}
                      alt={mentorData?.fullName}
                    />
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-500 to-yellow-500 text-white">
                      {mentorData?.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col justify-evenly">
                    <div className="flex items-center gap-1 bg-blue-50 border text-blue-700 hover:bg-blue-100 border-blue-500 py-1 px-2 rounded-[10px]">
                      <label>Rating -</label>
                      {/* Stars */}
                      {[...Array(5)].map((_, index) => (
                        <Star
                          key={index}
                          className={`h-4 w-4 ${
                            index < Math.round(mentorData.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex items-center gap-1 bg-blue-50 border text-blue-700 hover:bg-blue-100 border-blue-500 py-1 px-2 rounded-[10px]">
                      <label>Experience -</label>

                      {mentorData.experience}
                    </div>
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h1 className="lg:text-3xl text-2xl font-bold text-slate-900 mb-2 text-nowrap">
                        {mentorData.fullName}
                      </h1>

                      {!mentorData?.qualifications?.display ? (
                        <p className="text-lg text-slate-600 mb-2">
                          Qualification -
                          {mentorData?.postGraduation?.degree
                            ? "Post Graduation"
                            : "Graduation"}
                        </p>
                      ) : (
                        <p className="text-lg text-slate-600 mb-2 capitalize">
                          Qualification - {""}
                          {mentorData?.postGraduation?.degree},{" "}
                          {mentorData?.graduation?.degree}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-2  mb-3 ">
                        {sortedSubjects.map(
                          (subject, index) =>
                            index < 3 && (
                              <Badge
                                key={subject}
                                className="bg-blue-50 text-blue-700 text-sm hover:bg-blue-100 border-blue-200"
                              >
                                {subject}
                              </Badge>
                            ),
                        )}
                        {subjects.length > 4 && (
                          <Badge
                            onClick={handleScroll}
                            variant="outline"
                            className="border-yellow-400 text-yellow-700"
                          >
                            +{subjects.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="bg-blue-50 border flex-col lg:hidden gap-2 mb-2 border-blue-200 flex items-center py-2 rounded-[10px] justify-center">
                      <CardTitle className="text-slate-800 text-md flex items-center gap-2 w-[90%]">
                        <Home className="h-4 w-4 text-blue-600" />
                        About {mentorData.fullName.split(" ")[0]}{" "}
                        {mentorData.gender == "female" ? "mam" : "sir"}
                      </CardTitle>
                      {!mentorData?.adminBriefVisible ? (
                        <p className="text-slate-700 leading-relaxed  w-[90%] text-sm">
                          {mentorData?.brief}
                        </p>
                      ) : (
                        <p className="text-slate-700 leading-relaxed  w-[90%] text-sm">
                          {mentorData?.adminBrief}
                        </p>
                      )}
                    </div>
                    <BookingCard
                      mentorData={mentorData}
                      payNow={payNow}
                    ></BookingCard>
                    <div className="flex flex-row lg:hidden justify-center gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-blue-500 text-blue-600 hover:bg-blue-50"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Send Message
                      </Button>
                      <a
                        onClick={() => sendCallRequest()}
                        href={`tel:${callingNo}`}
                        className=" lg:text-md text-[10px]"
                      >
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-blue-500 w-full text-blue-600 hover:bg-blue-50"
                        >
                          <PhoneCall className="h-4 w-4 mr-2" />
                          Call
                        </Button>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          <LoginPopup
            isOpen={isLoginOpen}
            setIsPayment={setIsPayment}
            onClose={() => setIsLoginOpen(false)}
          />
          {/* Main Content Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="flex bg-white border shadow-sm">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                Overview
              </TabsTrigger>

              <TabsTrigger
                value="availability"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                Availability
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600"
              >
                Contact
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card className="shadow-lg border-0">
                    <CardHeader className="bg-white border-b border-slate-100">
                      <CardTitle className="text-slate-800 flex items-center gap-2">
                        <Home className="h-5 w-5 text-blue-600" />
                        About Our Home Tutor
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="lg:p-6 bg-white">
                      <p className="text-slate-700 leading-relaxed mb-4">
                        {mentorData?.brief}
                      </p>
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">
                          🏠 HomeMentor Advantage:
                        </h4>
                        <p className="text-sm text-slate-700">
                          Learn comfortably at home with personalized attention.
                          No travel hassles for parents - our qualified teachers
                          come to your location for convenient, effective
                          learning sessions.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="shadow-lg border-0">
                    <CardHeader className="bg-white border-b border-slate-100">
                      <CardTitle className="text-slate-800">
                        Teaching Approach
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 bg-white">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {teacherData.teachingAreas.map((area) => (
                          <div
                            key={area}
                            className="text-center p-3 bg-gradient-to-br from-blue-50 to-yellow-50 rounded-lg border border-slate-200"
                          >
                            <span className="text-sm font-medium text-slate-800">
                              {area}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <Card ref={targetDivRef} className="shadow-lg border-0">
                    <CardHeader className="bg-white border-b border-slate-100">
                      <CardTitle className="text-slate-800">
                        Subjects & Specializations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 bg-white">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {subjects.map((subject) => (
                          <div
                            key={subject}
                            className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-blue-50 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm font-medium text-slate-800">
                              {subject}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-6"></div>
              </div>
            </TabsContent>

            <TabsContent value="experience" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-white border-b border-slate-100">
                    <CardTitle className="text-slate-800">
                      Teaching Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 bg-white">
                    <div className="space-y-6">
                      {teacherData.experience.map((exp, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-blue-400 pl-4 bg-slate-50 p-4 rounded-r-lg"
                        >
                          <h3 className="font-semibold text-lg text-slate-800">
                            {exp?.role}
                          </h3>
                          <p className="text-blue-600 font-medium">
                            {exp?.school}
                          </p>
                          <p className="text-sm text-slate-600 mb-2">
                            {exp?.duration}
                          </p>
                          <p className="text-slate-700 text-sm">
                            {exp?.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-white border-b border-slate-100">
                    <CardTitle className="text-slate-800">Education</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 bg-white">
                    <div className="space-y-6">
                      {teacherData?.education.map((edu, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-yellow-400 pl-4 bg-slate-50 p-4 rounded-r-lg"
                        >
                          <h3 className="font-semibold text-lg text-slate-800">
                            {edu?.degree}
                          </h3>
                          <p className="text-yellow-600 font-medium">
                            {edu?.school}
                          </p>
                          <p className="text-sm text-slate-600">{edu?.year}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-white border-b border-slate-100">
                  <CardTitle className="text-slate-800">
                    Parent Reviews ({teacherData.totalReviews})
                  </CardTitle>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-2xl font-bold text-blue-700">
                        {teacherData.rating}
                      </span>
                    </div>
                    <Progress
                      value={98}
                      className="flex-1 max-w-xs [&>div]:bg-yellow-400"
                    />
                    <span className="text-sm text-slate-600">98% positive</span>
                  </div>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <div className="space-y-6">
                    {teacherData.reviews.map((review) => (
                      <div
                        key={review.id}
                        className="border-b border-slate-100 pb-6 last:border-0"
                      >
                        <div className="flex items-start gap-4">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={review.avatar}
                              alt={review.name}
                            />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-yellow-400 text-white">
                              {review.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-semibold text-slate-800">
                                {review.name}
                              </span>
                              <div className="flex items-center">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-slate-600">
                                {review.date}
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Quote className="h-4 w-4 text-yellow-500 mt-1 flex-shrink-0" />
                              <p className="text-slate-700">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="availability" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="bg-white border-b border-slate-100">
                  <CardTitle className="text-slate-800">
                    Available Time Slots for Home Tutoring
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teacherData.availability.map((day) => (
                      <div
                        key={day.day}
                        className="border border-slate-200 rounded-lg p-4 bg-slate-50"
                      >
                        <h3 className="font-semibold mb-3 text-slate-800">
                          {day.day}
                        </h3>
                        <div className="space-y-2">
                          {day.times.map((time) => (
                            <Button
                              key={time}
                              variant="outline"
                              size="sm"
                              className="w-full border-blue-300 text-blue-700 hover:bg-blue-50"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="shadow-lg border-0">
                  <CardHeader className="bg-white border-b border-slate-100">
                    <CardTitle className="text-slate-800">
                      Contact & Session Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 p-6 bg-white">
                    <Button
                      className="w-full justify-start bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white"
                      size="lg"
                    >
                      <Home className="h-4 w-4 mr-3" />
                      Schedule Home Visit
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-blue-500 text-blue-600 hover:bg-blue-50"
                      size="lg"
                    >
                      <Video className="h-4 w-4 mr-3" />
                      Video Call Session
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-blue-500 text-blue-600 hover:bg-blue-50"
                      size="lg"
                    >
                      <Phone className="h-4 w-4 mr-3" />
                      Phone Consultation
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-blue-500 text-blue-600 hover:bg-blue-50"
                      size="lg"
                    >
                      <MessageCircle className="h-4 w-4 mr-3" />
                      Chat with Teacher
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start border-blue-500 text-blue-600 hover:bg-blue-50"
                      size="lg"
                    >
                      <Mail className="h-4 w-4 mr-3" />
                      Email Discussion
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default MentorDetails;
