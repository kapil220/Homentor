import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Calendar, DollarSign, Settings, PhoneCall, LogOut } from 'lucide-react';
import NoBookingCard from '@/comp/NoBookingCard';
import axios from 'axios';
import ClassCard from '@/comp/ClassCard';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
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
        `https://homentor-backend.onrender.com/api/users/login-check`,
        { phone: studentNumber }
      );
      console.log(response.data.data)
      setStudentDetail(response.data.data);

      const res = await axios.get(
        `https://homentor-backend.onrender.com/api/class-bookings/student/${response.data.data._id}`
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Navbar></Navbar>
      <div className="container mx-auto px-4 py-8 mt-[8vh]">
        { !studentDetail ? <p>Loading...</p> :
        <AllBookingsPage userType="parent" userId={studentDetail._id}></AllBookingsPage>  }
      </div>      
    </div>
  );
};

export default ParentBookingsPage;
