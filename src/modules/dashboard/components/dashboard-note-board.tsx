import React, { useState, useEffect, useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { WidgetItem } from '../interfaces/dashboard.interface';

import { DASH_BOARD_NOTE_LIST } from '../constants/dashboard-data.constant';

import Note from './dashboard-note';
import { ViewFrame, ViewFrameDashboard } from '@/modules/chat/validation/ViewFarm';
import { useWidgetModal } from '@/modules/dashboard/hooks/useWidgetModal';
import AugmentedPopup from '@/modules/augmented/components/augmented-popup';
import { Button } from '@/components/ui/button';
import { ComponentBaseProps } from '@/common/interfaces';
import InputWidget from './input-widget';

type DashboardNotesBoardProps = ComponentBaseProps & {
  address?: string;
};

const DashboardNotesBoard: React.FC<DashboardNotesBoardProps> = ({ address }) => {
  const { widgets, addWidget, removeWidget } = useWidgetModal();
  const [widgetsList, setWidgetsList] = useState<any>(widgets);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(null);

  const checkIfWidgetHasButton = useCallback((code: string) => {
    //console.log('code', code);
    return code.toLowerCase().includes('<a') || code.toLowerCase().includes('a>');
  }, []);

  const moveNote = (fromIndex: number, toIndex: number) => {
    //moveWidget(fromIndex, toIndex);
    const updatedWidgets = [...widgetsList];
    const [movedWidget] = updatedWidgets.splice(fromIndex, 1);

    updatedWidgets.splice(toIndex, 0, movedWidget);
    console.log('updatedWidgets', updatedWidgets);
    setWidgetsList(updatedWidgets);
  };

  const handleWidgetClick = (widgetId: string, code: string) => {
    if (!address) {
      setSelectedWidgetId(widgetId);
      setShowPopup(true);
    }
  };

  const handleConfirmRemove = () => {
    if (selectedWidgetId) {
      removeWidget(selectedWidgetId);
    }
    setShowPopup(false);
  };

  useEffect(() => {
    if (widgets.length === 0) {
      const welcomeWidget = {
        _id: '1',
        index: 0,
        type: 'text',
        content: 'Welcome',
        size: 'xs-small'
      };

      const toWidget = {
        _id: '2',
        index: 1,
        type: 'text',
        content: 'To',
        size: 'xs-small'
      };

      const promptWalletWidget = {
        _id: '3',
        index: 2,
        type: 'image',
        tool: { code: 'background.jpg', description: 'Prompt Wallet' },
        size: 'large'
      };
      // @ts-ignore
      addWidget(welcomeWidget);
      // @ts-ignore
      addWidget(toWidget);
      // @ts-ignore
      addWidget(promptWalletWidget);
      setWidgetsList([welcomeWidget, toWidget, promptWalletWidget]);
    } else {
      setWidgetsList(widgets);
    }
  }, [widgets]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex min-h-[200px] flex-wrap px-6">
        {widgetsList.map((widget: any, index: number) => (
          <Note
            key={widget.index}
            id={widget.index}
            index={index}
            moveNote={moveNote}
            size={widget.size || 'medium'}
            onClick={() => handleWidgetClick(widget._id, widget.tool?.code)}
          >
            {widget.type === 'image' ? (
              <img src={widget.tool?.code} alt={widget.tool?.description || 'Widget Image'} />
            ) : widget.type === 'text' ? (
              <span>{widget.content}</span>
            ) : (
              <ViewFrameDashboard id={widget._id.toString()} code={widget.tool?.code} />
            )}
          </Note>
        ))}
      </div>
      <AugmentedPopup visible={showPopup} onClose={() => setShowPopup(false)} textHeading="Remove Widget">
        <div className="flex flex-col gap-5 p-8">
          <p>{`Are you sure you want to remove this widget?`}</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button onClick={() => setShowPopup(false)}>{`Cancel`}</Button>
            <Button onClick={handleConfirmRemove}>{`Remove`}</Button>
          </div>
        </div>
      </AugmentedPopup>
    </DndProvider>
  );
};

export default DashboardNotesBoard;
