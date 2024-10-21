'use client';

import { FC, useState, useRef } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { ComponentBaseProps } from '@/common/interfaces';
import { useWidgetModal } from '@/modules/dashboard/hooks/useWidgetModal';

import DashboardWidgetToolToggleButton from './dashboard-widget-tool-toggle-button';
import Link from 'next/link';

type DashboardWidgetToolsProps = ComponentBaseProps;

const DashboardWidgetTools: FC<DashboardWidgetToolsProps> = ({ className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { openWidgetModal, addImageWidget, addWidget } = useWidgetModal();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleToggle = (isActive: boolean) => {
    setIsVisible(isActive);
  };

  const handleOpenWidgetModal = () => {
    console.log('Attempting to open widget modal');
    openWidgetModal();
  };

  const handleUploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input triggered');
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64Image = await convertToBase64(file);
        console.log('Image converted to base64');
        addImageWidget(base64Image);
      } catch (error) {
        console.error('Error converting image:', error);
        // Handle error (e.g., show an error message to the user)
      }
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAddInputWidget = () => {
    const newWidget = {
      _id: Date.now().toString(),
      type: 'input',
      name: 'Input Widget',
      icon: 'ico-file-text-edit',
      tool: {
        code: 'default'
      },
      size: 'small'
    };
    addWidget(newWidget);
  };

  return (
    <div className={classNames('flex justify-end gap-4', className)}>
      <div className="h-10 grow overflow-hidden">
        <motion.div
          className="flex h-full items-center justify-center gap-8 rounded-sm border-2 border-[#5F5C64]"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 40 }}
          transition={{ duration: 0.3 }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleUploadImage}
            style={{ display: 'none' }}
            ref={fileInputRef}
          />
          <button type="button" onClick={handleImageButtonClick}>
            <i className="ico-image text-xl" />
          </button>
          <button onClick={handleOpenWidgetModal}>
            <i className="ico-layout-web-12 text-xl" />
          </button>
          <button onClick={handleAddInputWidget}>
            <i className="ico-file-text-edit text-xl" />
          </button>
          <Link href="/chat">
            <i className="ico-ai text-xl" />
          </Link>
        </motion.div>
      </div>
      <DashboardWidgetToolToggleButton className="shrink-0" onToggle={handleToggle} />
    </div>
  );
};

export default DashboardWidgetTools;
