import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import CustomButton from '@/libs/svg-icons/input/custom-button';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export type SelectOption = {
  label: string;
  value: string;
};

interface IDropdownSelectProps {
  options: SelectOption[];
  onSelect: (value: string) => void;
  initialValue?: string; // Optional prop for initial selected value
}

const DropdownSelect: React.FC<IDropdownSelectProps> = ({ options, onSelect, initialValue }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState<string | null>(initialValue || null);
  const dropdownRef = useRef<HTMLDivElement | null>(null); // Ref for the dropdown

  useEffect(() => {
    if (initialValue) {
      console.log(options)
      const selectedOption = options.find(option => option.value === initialValue);

      if (selectedOption) {
        setSelectedValue(selectedOption.label);
      }
    }
  }, [initialValue, options]);

  const toggleDropdown = () => {
    setIsOpen(prev => !prev);
  };

  const handleOptionSelect = (value: string) => {
    const selectedOption = options.find(option => option.value === value);
    router.push(value)

  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block">
      <CustomButton
        className="flex w-full min-w-48 items-center justify-between px-1 normal-case md:w-auto"
        onClick={toggleDropdown}
      >
        {selectedValue || 'Select an option'}
        <motion.i
          className="ico-caret-down text-[10px]"
          animate={{ rotate: isOpen ? 180 : 0 }} // Rotate 180 degrees when open
          transition={{ duration: 0.3 }} // Duration of the rotation animation
        />
      </CustomButton>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute z-10 mt-2 w-full overflow-hidden rounded border border-[#5F5C64] bg-[#2C3035] shadow-lg"
            initial={{ opacity: 0, scale: 0.4, scaleY: 0.4 }} // Start slightly above, transparent, and scaled down
            animate={{ opacity: 1, scale: 1, scaleY: 1 }} // Animate to visible position and scale up
            exit={{ opacity: 0, scale: 0.4, scaleY: 0.4 }} // Animate back to above, transparent, and scaled down
            transition={{ duration: 0.3 }} // Duration of the animation
            style={{ transformOrigin: 'top' }} // Set transform origin to top
          >
            {options.map(option => (
              <div
                key={option.value}
                className="cursor-pointer p-2 transition-all duration-300 hover:bg-gray-200 hover:text-[#2C3035]"
                onClick={() => handleOptionSelect(option.value)}
              >
                <Link href={option.value} >
                  {option.label}
                </Link>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownSelect;
