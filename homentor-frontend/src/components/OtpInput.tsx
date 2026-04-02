import React, { useState, useRef, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import axios from "axios";

interface OtpInputProps {
  phoneNumber: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
}

const OtpInput: React.FC<OtpInputProps> = ({
  phoneNumber,
  onVerify,
  onResend,
}) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    // Countdown timer
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple characters

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit !== "") && newOtp.join("").length === 6) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      // Focus previous input on backspace if current is empty
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const digits = pastedData.replace(/\D/g, "").slice(0, 6).split("");

    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 6) {
        newOtp[index] = digit;
      }
    });

    setOtp(newOtp);

    // Focus next empty input or last input
    const nextEmptyIndex = newOtp.findIndex((digit) => digit === "");
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    // Auto-submit if all filled
    if (newOtp.every((digit) => digit !== "")) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleVerify = async (otpCode: string) => {
    setIsLoading(true);
    localStorage.setItem("usernumber", phoneNumber);

    onVerify(otpCode);
    setIsLoading(false);
  };

  const handleResend = () => {
    setCountdown(30);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
    onResend();
  };

  const maskPhoneNumber = (phone: string) => {
    if (phone.length <= 4) return phone;
    const visible = phone.slice(-4);
    const masked = "*".repeat(phone.length - 4);
    return masked + visible;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600 mb-2">Enter the 6-digit code sent to</p>
        <p className="font-medium text-gray-900">
          {maskPhoneNumber(phoneNumber)}
        </p>
      </div>

      <div className="space-y-4">
        {/* OTP Input Fields */}
        <div className="flex justify-center gap-2 sm:gap-3 flex-wrap">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInputChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              disabled={isLoading}
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={() => handleVerify(otp.join(""))}
          disabled={otp.some((digit) => digit === "") || isLoading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Verifying...
            </>
          ) : (
            <>
              Verify OTP
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Resend Section */}
        <div className="text-center">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-500 text-sm">Resend OTP in {countdown}s</p>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-gray-500">
        Didn't receive the code? Check your SMS or try resending
      </div>
    </div>
  );
};

export default OtpInput;
