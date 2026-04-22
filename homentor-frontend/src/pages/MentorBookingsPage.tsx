import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Calendar, DollarSign, Settings, PhoneCall, LogOut } from 'lucide-react';
import NoBookingCard from '@/comp/NoBookingCard';
import axios from 'axios';
import ClassCard from '@/comp/ClassCard';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import AllBookingsPage from './AllBookingsPage';

const MentorBookingsPage = () => {
  const mentorNumber = localStorage.getItem("mentor");
  const [mentorData, setMentorData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMentorDetail = async () => {
    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/mentor/login-check`,
        { phone: mentorNumber }
      );
      console.log(response.data.data)
      setMentorData(response.data.data);

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/class-bookings/mentor-bookings/${response.data.data._id}`
      );
      console.log(res.data.data)
      setBookings(res.data.data);
      setLoading(false)

    } catch (error) {
      console.error("Failed to fetch student", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMentorDetail();
  }, []);

  const navigate = useNavigate();


  return (
    <DashboardLayout role="mentor" title="Your Bookings" subtitle="All classes assigned to you">
      {!mentorData ? <p className="text-gray-500">Loading...</p> :
        <AllBookingsPage userData={mentorData} userType="mentor" userId={mentorData._id}></AllBookingsPage>}
    </DashboardLayout>
  );
};

export default MentorBookingsPage;
