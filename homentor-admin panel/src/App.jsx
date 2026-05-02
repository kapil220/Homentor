import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import MentorRequest from "./pages/MentorRequest";
import AllMentor from "./pages/AllMentor";
import Setting from "./pages/Setting";
import CallAdmin from "./pages/CallAdmin";
import AllOrders from "./pages/AllOrders";
import AdminBookingsPage from "./pages/AdminBookingsPage";
import AdminMarginRules from "./pages/AdminMarginRules";
import AdminMentorLeadsPage from "./pages/AdminMentorLeadsPage";
import AdminParentLeadsPage from "./pages/AdminParentLeadsPage";
import AdminTeacherLeadsPage from "./pages/AdminTeacherLeadsPage";
import BookingRecord from "./pages/BookingRecord";
import ParentsPage from "./pages/ParentsPage";
import DegreeMaster from "./pages/DegreeMaster";
CallAdmin

function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<AdminDashboard></AdminDashboard>}></Route>
      <Route path="/mentor-request" element={<MentorRequest/>}></Route>
      <Route path="/all-mentor" element={<AllMentor/>}></Route>
      <Route path="/all-orders" element={<AllOrders/>}></Route>
      <Route path="/calling-sheet" element={<CallAdmin/>}></Route>
      <Route path="/booking-record" element={<BookingRecord/>}></Route>
      <Route path="/parents" element={<ParentsPage/>}></Route>
      <Route path="/setting" element={<Setting/>}></Route>
      <Route path="/class-booking" element={<AdminBookingsPage/>}></Route>
      <Route path="/margin-rules" element={<AdminMarginRules/>}></Route>
      <Route path="/mentor-leads" element={<AdminMentorLeadsPage/>}></Route>
      <Route path="/parent-leads" element={<AdminParentLeadsPage/>}></Route>
      <Route path="/teacher-leads" element={<AdminTeacherLeadsPage/>}></Route>
      <Route path="/degree-master" element={<DegreeMaster/>}></Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
