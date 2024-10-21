import { useEffect, useRef } from 'react';

interface ISmoothDragToScrollOptions {
  sensitivity?: number;
}

const useSmoothDragToScroll = (
  ref: React.RefObject<HTMLDivElement>,
  options: ISmoothDragToScrollOptions = {}
): void => {
  const { sensitivity = 1 } = options;
  const startXRef = useRef<number>(0);
  const startYRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);

  useEffect(() => {
    const handleDragStart = (event: MouseEvent | TouchEvent) => {
      startXRef.current = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
      startYRef.current = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
      isDraggingRef.current = true;
      ref.current?.classList.add('cursor-grab');
    };

    const handleDrag = (event: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current || !ref.current) return;

      const deltaX = (event instanceof MouseEvent ? event.clientX : event.touches[0].clientX) - startXRef.current;
      const deltaY = (event instanceof MouseEvent ? event.clientY : event.touches[0].clientY) - startYRef.current;

      ref.current.scrollLeft -= deltaX * sensitivity;
      ref.current.scrollTop -= deltaY * sensitivity;

      startXRef.current = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
      startYRef.current = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;
    };

    const handleDragEnd = () => {
      isDraggingRef.current = false;
      ref.current?.classList.remove('cursor-grab');
    };

    const handleMouseLeave = () => {
      isDraggingRef.current = false;
    };

    const element = ref.current;

    if (element) {
      element.addEventListener('mousedown', handleDragStart);
      element.addEventListener('mousemove', handleDrag);
      element.addEventListener('mouseup', handleDragEnd);
      element.addEventListener('touchend', handleDragEnd);
      element.addEventListener('mouseleave', handleMouseLeave); // Add mouseleave event listener
    }

    return () => {
      if (element) {
        element.removeEventListener('mousedown', handleDragStart);
        element.removeEventListener('mousemove', handleDrag);
        element.removeEventListener('mouseup', handleDragEnd);
        element.removeEventListener('touchend', handleDragEnd);
        element.removeEventListener('mouseleave', handleMouseLeave); // Remove mouseleave event listener
      }
    };
  }, [ref, sensitivity]);
};

export default useSmoothDragToScroll;
