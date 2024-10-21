import React, { useState } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { ComponentBaseProps } from '@/common/interfaces';

interface IDashboardWidgetToolToggleButtonProps extends ComponentBaseProps {
  onToggle?: (isActive: boolean) => void; // Function to handle toggle
}

const DashboardWidgetToolToggleButton: React.FC<IDashboardWidgetToolToggleButtonProps> = ({ className, onToggle }) => {
  const [isActive, setIsActive] = useState(false);

  const horizontalLineVariants = {
    active: { rotate: 90, opacity: 0 },
    inactive: { rotate: 0, opacity: 1 }
  };

  const handleToggle = () => {
    const isNewActiveState = !isActive;

    setIsActive(isNewActiveState);
    onToggle?.(isNewActiveState); // Call the onToggle function with the new state
  };

  return (
    <motion.button
      className={classNames(
        'flex h-10 w-10 items-center justify-center rounded-sm border-2 border-[#5F5C64]',
        className
      )}
      onClick={handleToggle}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <motion.line
          x1="12"
          y1="5"
          x2="12"
          y2="19"
          variants={horizontalLineVariants}
          animate={isActive ? 'active' : 'inactive'}
          transition={{ duration: 0.3 }}
        />
      </svg>
    </motion.button>
  );
};

export default DashboardWidgetToolToggleButton;
