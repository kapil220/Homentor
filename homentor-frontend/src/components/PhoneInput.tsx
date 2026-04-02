import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface PhoneInputProps {
  onSubmit: (phoneNumber: string) => void;
}

const countries = [
  { code: '+1', name: 'US', flag: '🇺🇸' },
  { code: '+44', name: 'UK', flag: '🇬🇧' },
  { code: '+91', name: 'IN', flag: '🇮🇳' },
  { code: '+86', name: 'CN', flag: '🇨🇳' },
  { code: '+81', name: 'JP', flag: '🇯🇵' },
  { code: '+49', name: 'DE', flag: '🇩🇪' },
  { code: '+33', name: 'FR', flag: '🇫🇷' },
];

const PhoneInput: React.FC<PhoneInputProps> = ({ onSubmit }) => {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber.trim()) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onSubmit(phoneNumber);
    setIsLoading(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;    
    setPhoneNumber(value);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600">
          Enter your mobile number to receive a verification code
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Mobile Number
          </label>
          <div className="flex">

            {/* Phone Input */}
            <input
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneChange}
              placeholder="Enter your number"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!phoneNumber.trim() || isLoading}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Sending OTP...
            </div>
          ) : (
            'Send OTP'
          )}
        </button>
      </form>

      <div className="text-center text-xs text-gray-500">
        By continuing, you agree to our Terms of Service and Privacy Policy
      </div>
    </div>
  );
};

export default PhoneInput;