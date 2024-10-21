import React, { useState } from 'react';
import { useWidgetModal } from '@/modules/dashboard/hooks/useWidgetModal';

interface InputWidgetProps {
  widgetId: string;
  initialValue?: string;
}

const InputWidget: React.FC<InputWidgetProps> = ({ widgetId, initialValue = '' }) => {
  const [inputValue, setInputValue] = useState(initialValue);
  const { addWidget } = useWidgetModal();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Cập nhật widget trong store
    addWidget({
      _id: widgetId,
      type: 'input',
      name: 'Input Widget',
      icon: 'ico-file-text-edit',
      tool: {
        code: newValue
      },
      size: 'medium'
    });
  };

  return (
    <input
      type="text"
      value={inputValue}
      onChange={handleInputChange}
      className="w-full rounded border p-2"
      placeholder="Enter text here"
    />
  );
};

export default InputWidget;
