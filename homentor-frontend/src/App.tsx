
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Mentors from "./pages/Mentors";
import MentorProfile from "./pages/MentorProfile";
import StudentDashboard from "./pages/StudentDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
// import ChatPage from "./pages/ChatPage";
import { LoadScript } from '@react-google-maps/api';
import SelectedMentors from "./pages/SelectedMentors";
import TermsCondition from "./pages/TermsCondition";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Refund from "./pages/Refund";
import PaymentSuccessful from "./pages/PaymentSuccessful";
import CallAdmin from "./pages/CallAdmin";
import BackUpTeacherProfile from "./pages/BackUpTeacherProfile";
import ParentBookingsPage from "./pages/ParentBookingsPage";
import MentorBookingsPage from "./pages/MentorBookingsPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
     <LoadScript googleMapsApiKey="AIzaSyAb6ZthJEvNAczmOeuvFrnwEcMJjhlNpUk" libraries={['places']}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/selected-mentors" element={<SelectedMentors />} />
          <Route path="/mentors/:id" element={<MentorProfile />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/parent/bookings" element={<ParentBookingsPage />} />
          <Route path="/mentor/bookings" element={<MentorBookingsPage />} />
          <Route path="/dashboard/mentor" element={<MentorDashboard />} />
          <Route path="/call-admin" element={<CallAdmin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/terms-conditions" element={<TermsCondition />} />
          <Route path="/payment-status" element={<PaymentSuccessful />} />
          <Route path="/refund" element={<Refund />} />
          <Route path="/back-up-teacher-profile" element={<BackUpTeacherProfile />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          {/* <Route path="/chat/:mentorPhone" element={<ChatPage/>} /> */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
    </LoadScript>
  </QueryClientProvider>
);

export default App;
