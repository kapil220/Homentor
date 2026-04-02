// SettingCard.tsx
import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminLayout from "../comp/AdminLayout";
import MentorEditModal from "../comp/MentorEditModal";
import DisclaimerManager from "../comp/DisclaimerManager";

const Setting = () => {
  useEffect(() => {
    getAdminData();
  }, []);
  const [adminData, setAdminData] = useState([]);
  const getAdminData = () => {
    axios
      .get("https://homentor-backend.onrender.com/api/admin")
      .then((res) => {
        setAdminData(res.data.data[0]);
        setCallingNo(res.data.data[0].callingNo)
      });
  };
  
  const [callingNo, setCallingNo] = useState("")
  const postNumber = () => {
    try {
      axios
        .put(`https://homentor-backend.onrender.com/api/admin/${adminData._id}`, {
          callingNo: callingNo,
        })
        .then(() => {
          alert("Number Updated");
          getAdminData();
        });
    } catch (error) {
      console.error("Failed to update visibility:", error);
    }
  };
  return (
    <AdminLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Setting
        </h2>
        <div>
          <label>Calling Number</label>
          <input value={callingNo} onChange={(e)=> setCallingNo(e.target.value)} placeholder="Enter Number"/>
          <button onClick={()=> postNumber()}>Submit</button>
        </div>

        <DisclaimerManager></DisclaimerManager>
        
      </div>
    </AdminLayout>
  );
};

export default Setting;
