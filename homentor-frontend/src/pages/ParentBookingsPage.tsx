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

const ParentBookingsPage = () => {
  const studentNumber = localStorage.getItem("usernumber");
  const [studentDetail, setStudentDetail] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const getStudentDetail = async () => {
    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/users/login-check`,
        { phone: studentNumber }
      );
      console.log(response.data.data)
      setStudentDetail(response.data.data);

      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/class-bookings/student/${response.data.data._id}`
      );
      setBookings(res.data.data);
      setLoading(false)

    } catch (error) {
      console.error("Failed to fetch student", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getStudentDetail();
  }, []);

  const navigate = useNavigate();
  

  return (
    <DashboardLayout role="student" title="Your Bookings" subtitle="All classes you've booked">
      { !studentDetail ? <p className="text-gray-500">Loading...</p> :
        <AllBookingsPage userType="parent" userId={studentDetail._id}></AllBookingsPage>  }
    </DashboardLayout>
  );
};

export default ParentBookingsPage;
