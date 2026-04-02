import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SuccessModal({ open, onClose, redirectTo }) {
  const navigate = useNavigate();

  if (!open) return null;

  const handleOk = () => {
    onClose();
    navigate(redirectTo);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 animate-scaleIn">
        <div className="flex flex-col items-center text-center">
          <CheckCircle className="h-14 w-14 text-green-500 mb-3" />
          <h2 className="text-xl font-semibold text-gray-800">
            Free Demo Booked Successfully 🎉
          </h2>

          <p className="text-sm text-gray-600 mt-2">
            Kindly fill the address in the next form to proceed further.
          </p>

          <button
            onClick={handleOk}
            className="mt-6 px-6 py-2 rounded-lg bg-homentor-blue hover:bg-homentor-darkBlue text-white font-medium transition"
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
}
