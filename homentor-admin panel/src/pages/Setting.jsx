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
      .get(`${import.meta.env.VITE_API_BASE_URL}/admin`)
      .then((res) => {
        const cfg = res.data.data?.[0] || {};
        setAdminData(cfg);
        setCallingNo(cfg.callingNo || "");
        setCallingMode(cfg.callingMode || "direct");
        setOnlinePaymentMode(cfg.onlinePaymentMode || "gateway");
        setUpiId(cfg.upiId || "");
        setBankAccountName(cfg.bankAccountName || "");
        setBankAccountNumber(cfg.bankAccountNumber || "");
        setBankIfsc(cfg.bankIfsc || "");
        setBankName(cfg.bankName || "");
        setPaymentInstructions(cfg.paymentInstructions || "");
        const commission = cfg.commissionByCategory || {};
        setCommissionGold(commission.gold || 0);
        setCommissionSilver(commission.silver || 0);
        setCommissionBudget(commission.budget || 0);
      });
  };

  const [callingNo, setCallingNo] = useState("")
  const [callingMode, setCallingMode] = useState("direct")
  const [onlinePaymentMode, setOnlinePaymentMode] = useState("gateway")
  const [upiId, setUpiId] = useState("")
  const [bankAccountName, setBankAccountName] = useState("")
  const [bankAccountNumber, setBankAccountNumber] = useState("")
  const [bankIfsc, setBankIfsc] = useState("")
  const [bankName, setBankName] = useState("")
  const [paymentInstructions, setPaymentInstructions] = useState("")
  const [commissionGold, setCommissionGold] = useState(0);
  const [commissionSilver, setCommissionSilver] = useState(0);
  const [commissionBudget, setCommissionBudget] = useState(0);

  const postNumber = () => {
    try {
      axios
        .put(`${import.meta.env.VITE_API_BASE_URL}/admin/${adminData._id}`, {
          callingNo,
          callingMode,
          onlinePaymentMode,
          upiId,
          bankAccountName,
          bankAccountNumber,
          bankIfsc,
          bankName,
          paymentInstructions,
          commissionByCategory: {
            gold:   Number(commissionGold),
            silver: Number(commissionSilver),
            budget: Number(commissionBudget),
          },
        })
        .then(() => {
          alert("Settings Updated");
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
        <div className="bg-white rounded-xl shadow p-4 mb-6 max-w-xl">
          <h3 className="text-lg font-semibold mb-3">Calling Configuration</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Calling Number</label>
            <input
              value={callingNo}
              onChange={(e)=> setCallingNo(e.target.value)}
              placeholder="Enter Number"
              className="border rounded-lg px-3 py-2 text-sm w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Calling Mode</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="callingMode"
                  value="direct"
                  checked={callingMode === "direct"}
                  onChange={(e)=> setCallingMode(e.target.value)}
                />
                Direct (tel: link)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="callingMode"
                  value="exotel"
                  checked={callingMode === "exotel"}
                  onChange={(e)=> setCallingMode(e.target.value)}
                />
                Exotel (server-mediated)
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Currently active: <strong>{callingMode}</strong>. Switch to reactivate Exotel without a code change.
            </p>
          </div>

          <button
            onClick={()=> postNumber()}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-6 max-w-xl">
          <h3 className="text-lg font-semibold mb-3">Online Payment Configuration</h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Online Payment Mode</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="onlinePaymentMode"
                  value="gateway"
                  checked={onlinePaymentMode === "gateway"}
                  onChange={(e)=> setOnlinePaymentMode(e.target.value)}
                />
                Gateway (PayU)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="onlinePaymentMode"
                  value="manual"
                  checked={onlinePaymentMode === "manual"}
                  onChange={(e)=> setOnlinePaymentMode(e.target.value)}
                />
                Manual UPI / Bank Transfer
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              When set to Manual, the "Book Now" button shows the UPI/bank details below to the user
              instead of opening the payment gateway. Bookings stay pending until you approve them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">UPI ID</label>
              <input
                value={upiId}
                onChange={(e)=> setUpiId(e.target.value)}
                placeholder="name@bank"
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
              <input
                value={bankAccountName}
                onChange={(e)=> setBankAccountName(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
              <input
                value={bankAccountNumber}
                onChange={(e)=> setBankAccountNumber(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">IFSC</label>
              <input
                value={bankIfsc}
                onChange={(e)=> setBankIfsc(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
              <input
                value={bankName}
                onChange={(e)=> setBankName(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Instructions (optional)</label>
              <textarea
                value={paymentInstructions}
                onChange={(e)=> setPaymentInstructions(e.target.value)}
                placeholder="e.g. Add booking ID in the UPI note"
                rows={2}
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />
            </div>
          </div>

          <button
            onClick={()=> postNumber()}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
          >
            Submit
          </button>
        </div>

        <div className="bg-white rounded-xl shadow p-4 mb-6 max-w-xl">
          <h3 className="text-lg font-semibold mb-3">Lead Commission (₹)</h3>
          <p className="text-sm text-gray-500 mb-4">
            Amount teacher pays to unlock a parent's contact details. Set 0 to auto-unlock.
          </p>
          {[
            { label: "Gold Teacher", value: commissionGold, set: setCommissionGold },
            { label: "Silver Teacher", value: commissionSilver, set: setCommissionSilver },
            { label: "Budget Teacher", value: commissionBudget, set: setCommissionBudget },
          ].map(({ label, value, set }) => (
            <div className="mb-3" key={label}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input
                type="number"
                min="0"
                value={value}
                onChange={(e) => set(e.target.value)}
                className="border rounded-lg px-3 py-2 text-sm w-full"
              />
            </div>
          ))}
        </div>

        <DisclaimerManager></DisclaimerManager>
        
      </div>
    </AdminLayout>
  );
};

export default Setting;
