import { FC, useState, useEffect, useCallback } from 'react';
import AugmentedPopup from '@/modules/augmented/components/augmented-popup';
import { useWidgetModal } from '@/modules/dashboard/hooks/useWidgetModal';
import { Button } from '@/components/ui/button';
import { ComponentBaseProps } from '@/common/interfaces';

interface WidgetOption {
  _id: string;
  type: string;
  name: string;
  icon: string;
}

export const
  WidgetSelectionModal: FC<any> = ({ className, session }) => {
    const { isOpen, closeWidgetModal, addWidget } = useWidgetModal();
    const [widgetOptions, setWidgetOptions] = useState<WidgetOption[]>([]);
    const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
    const userId = session.user.username;
    const [isLoading, setIsLoading] = useState(false);

    const fetchWidgetTools = useCallback(async () => {
      setIsLoading(true);

      try {
        const response = await fetch(`/api/tools?userId=${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tools');
        }
        const data = await response.json();
        const filteredTools = data.filter((tool: any) => tool.type === 'widgetTool');
        //console.log('filteredTools', filteredTools);
        setWidgetOptions(filteredTools);
      } catch (error) {
        console.error('Error fetching widget tools:', error);
      } finally {
        setIsLoading(false);
      }
    }, [userId]);

    useEffect(() => {
      fetchWidgetTools();
    }, [fetchWidgetTools]);

    useEffect(() => {
      if (!isOpen) {
        setSelectedWidget(null);
      }
    }, [isOpen]);

    const handleSelectWidget = (id: string) => {
      setSelectedWidget(id);
    };

    const handleAddWidget = () => {
      if (selectedWidget) {
        const widgetToAdd = widgetOptions.find(widget => widget._id === selectedWidget);
        if (widgetToAdd) {
          const sizes = ['small', 'medium', 'large'];
          const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
          const widgetWithSize = { ...widgetToAdd, size: 'fit', index: widgetOptions?.length };
          addWidget(widgetWithSize);
          closeWidgetModal();
        }
      }
    };

    return (
      <AugmentedPopup visible={isOpen} onClose={closeWidgetModal} textHeading="Select Widget">
        <div className="flex max-h-[80vh] flex-col gap-5 overflow-y-auto p-8">
          <div className="w-full">
            <select
              className="w-full rounded-md border border-gray-300 bg-black p-2"
              value={selectedWidget || ''}
              onChange={e => handleSelectWidget(e.target.value)}
              disabled={isLoading}
            >
              <option value="">{isLoading ? 'Loading widgets...' : 'Select a widget'}</option>
              {!isLoading &&
                widgetOptions.map(option => (
                  <option key={option._id} value={option._id}>
                    {option.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mt-4 flex justify-end">
            <Button onClick={handleAddWidget} disabled={!selectedWidget || isLoading}>
              {isLoading ? 'Loading...' : 'Add Widget'}
            </Button>
          </div>
        </div>
      </AugmentedPopup>
    );
  };
