import React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface MonthlyRateSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  className?: string;
}

const MonthlyRateSlider: React.FC<MonthlyRateSliderProps> = ({
  value,
  onValueChange,
  className = ""
}) => {
  const handleSliderChange = (values: number[]) => {
    const newValue = values[0];
    onValueChange(newValue);
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString()}`;
  };

  return (
    <div className={className}>
      <Label className="text-sm">Monthly Rate (₹) *</Label>
      <div className="mt-2 space-y-2">
        <div className="flex justify-between items-end text-[10px] text-gray-600">
          <span>₹1,000</span>
          <span className="font-medium text-[14px]">{formatCurrency(value)}</span>
          <span>₹25,000</span>
        </div>
        <Slider
          value={[value]}
          onValueChange={handleSliderChange}
          min={1000}
          max={25000}
          step={500}
          className="w-full md:w-64 focus:ring-mentor-yellow-400"
        />
        {/* <div className="text-xs text-gray-500">
          Drag to select your monthly rate (in multiples of ₹500)
        </div> */}
      </div>
    </div>
  );
};

export default MonthlyRateSlider;