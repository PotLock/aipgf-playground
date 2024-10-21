import React from 'react';
import Image from 'next/image';
import { useDrag, useDrop } from 'react-dnd';

import BoderImage from '@/components/common/border-image';

import WidgetFrame from '@/assets/svgs/widget-frame.svg';
import WidgetFrame2 from '@/assets/svgs/widget-frame-2.svg';
import WidgetNoteDecor from '@/assets/svgs/widget-note-decor.svg';

const ItemTypes = {
  NOTE: 'note'
};

interface INoteProps {
  id: number;
  index: number;
  moveNote: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
  size: 'small' | 'medium' | 'large';
  onClick: () => void;
}

const Note: React.FC<INoteProps> = ({ id, index, moveNote, children, size, onClick }) => {
  const [, drag] = useDrag({
    type: ItemTypes.NOTE,
    item: { id, index }
  });

  const [, drop] = useDrop({
    accept: ItemTypes.NOTE,
    hover: (draggedItem: { id: number; index: number }) => {
      if (draggedItem.index !== index) {
        moveNote(draggedItem.index, index);
        draggedItem.index = index;
      }
    }
  });

  const sizeClasses = {
    fit: 'w-full h-full',
    'xs-small': 'w-1/2 h-20', // 1x2 aspect ratio
    small: 'w-1/2 h-32', // 1x1 aspect ratio
    medium: 'w-1/2 h-64', // 1x2 aspect ratio
    large: 'w-full h-64' // 4x2 aspect ratio
  };

  return (
    <div
      ref={node => drag(drop(node))}
      className={`flex shrink-0 cursor-move items-center justify-center transition-all duration-300 ${sizeClasses[size]} p-2`}
      onDoubleClick={onClick}
    >
      <BoderImage
        imageBoder={size === 'small' ? WidgetFrame.src : WidgetFrame2.src}
        className="flex h-full w-full flex-col [border-image-slice:15_fill] [border-image-width:12px]"
      >
        <div className="grow p-2">{children}</div>
        <div className="flex shrink-0 justify-end">
          <Image
            src={WidgetNoteDecor.src}
            alt="Note Decor"
            width={WidgetNoteDecor.width}
            height={WidgetNoteDecor.height}
          />
        </div>
      </BoderImage>
    </div>
  );
};

export default Note;
