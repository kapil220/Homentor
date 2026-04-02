import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AnimatedSelectPlaceholder from './AnimatedSelectPlaceholder';

interface AnimatedSelectProps {
  onValueChange: (value: string) => void;
  placeholder?: string;
  value?: string;
  children: React.ReactNode;
}

const AnimatedSelect: React.FC<AnimatedSelectProps> = ({ 
  onValueChange, 
  placeholder,
  value,
  children 
}) => {
  const [hasValue, setHasValue] = useState(false);

  const handleValueChange = (value: string) => {
    setHasValue(true);
    onValueChange(value);
  };

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue 
          placeholder={
            !value ? (
              <AnimatedSelectPlaceholder  key={Date.now()} text={placeholder} />
            ) : undefined
          } 
        />
      </SelectTrigger>
      <SelectContent>
        {children}
      </SelectContent>
      
    </Select>
  );
};

export default AnimatedSelect;
