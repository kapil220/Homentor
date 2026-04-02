import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const states = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", 
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", 
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", 
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", 
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
  "Wisconsin", "Wyoming"
];

const StateSelector = () => {
  const [selectedState, setSelectedState] = useState<string>("");

  const handleReset = () => {
    setSelectedState("");
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Choose a State</label>
        <Select value={selectedState} onValueChange={setSelectedState}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select State" />
          </SelectTrigger>
          <SelectContent className="bg-white border border-gray-200 shadow-lg max-h-60 overflow-y-auto z-50">
            {states.map((state) => (
              <SelectItem 
                key={state} 
                value={state}
                className="cursor-pointer hover:bg-gray-100 px-3 py-2"
              >
                {state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedState && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div>
            <p className="text-sm text-gray-600">Selected State:</p>
            <p className="font-semibold text-blue-800">{selectedState}</p>
          </div>
          <Button 
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="hover:bg-red-50 hover:border-red-300 hover:text-red-700"
          >
            Reset
          </Button>
        </div>
      )}
    </div>
  );
};

export default StateSelector;