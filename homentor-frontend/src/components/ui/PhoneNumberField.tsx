import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function PhoneNumberField({ mentorData, updateFormData }) {
  const [phoneError, setPhoneError] = useState("");

  // Validation logic
  const validatePhone = (phone) => {
    if (!phone) return "Phone number is required";

    const cleanPhone = phone.replace(/\s/g, "");

    // Indian mobile number (10 digits or +91)
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;

    if (!phoneRegex.test(cleanPhone)) {
      return "Enter a valid Indian mobile number";
    }

    return "";
  };

  const handleChange = (e) => {
    // Allow only numbers and +
    const value = e.target.value.replace(/[^0-9+]/g, "");
    updateFormData({ phone: value });

    // Clear error while typing
    if (phoneError) setPhoneError("");
  };

  const handleBlur = () => {
    const error = validatePhone(mentorData.phone);
    setPhoneError(error);
  };

  return (
    <div className="space-y-1">
      <Label htmlFor="phone">
        Phone Number <span className="text-red-500">*</span>
      </Label>

      <Input
        id="phone"
        type="tel"
        placeholder="+91 9876543210"
        value={mentorData.phone}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`transition-all ${
          phoneError
            ? "border-red-500 focus:ring-red-500"
            : "focus:ring-mentor-yellow-400 focus:border-mentor-yellow-400"
        }`}
        required
      />

      {phoneError && (
        <p className="text-xs text-red-500">{phoneError}</p>
      )     }
    </div>
  );
}
