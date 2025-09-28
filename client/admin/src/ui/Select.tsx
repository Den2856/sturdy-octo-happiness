import React from 'react';
import { FaChevronDown } from 'react-icons/fa';

type SelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
};

const Select: React.FC<SelectProps> = ({ label, value, onChange, options }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold mb-2 text-gray-300">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 pr-10 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 outline-none appearance-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-colors"
        >
          {options.map((option) => (
            <option key={option} value={option} className="bg-gray-800 hover:bg-gray-700">
              {option}
            </option>
          ))}
        </select>
        {/* Dropdown icon */}
        <div className="absolute right-2 top-5 pointer-events-none">
          <FaChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default Select;
