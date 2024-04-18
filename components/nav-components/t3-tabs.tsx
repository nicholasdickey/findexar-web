// components/Tabs.tsx

import React from 'react';

interface Option {
    name: string;
    tab:string;
    disabled:boolean;
}
export interface TabsProps {
    options: Option[];
    onChange: (option: Option) => void;
    selectedOptionName?: string;
  }

  const Tabs: React.FC<TabsProps> = ({ options, onChange, selectedOptionName }) => {
    return (
      <div className="flex divide-x divide-gray-200 w-full">
        {options.map((option) => (
          <button
            key={option.name}
            className={`flex-1 py-2 text-sm font-medium text-center rounded-md 
              ${option.disabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'cursor-pointer'}
              ${option.name === selectedOptionName ? 'border-b-2 border-blue-500 bg-blue-50 text-blue-700' : 'hover:bg-blue-100 text-blue-600'}
            `}
            disabled={option.disabled}
            onClick={() => !option.disabled && onChange(option)}
          >
            {option.name}
          </button>
        ))}
      </div>
    );
  };

export default Tabs;
