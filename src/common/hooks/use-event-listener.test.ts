import { act, renderHook } from '@testing-library/react';

import useEventListener from './use-event-listener';

describe('useEventListener Hook', () => {
  test('should registers and unregisters event listener correctly', () => {
    const mockCallback = vi.fn();
    const div = document.createElement('div');
    let element: HTMLElement | null = null;

    const { rerender, unmount } = renderHook(() => useEventListener('click', mockCallback, element));

    act(() => div.click());

    expect(mockCallback).not.toHaveBeenCalled();

    element = div;

    rerender({ element });

    act(() => div.click());

    expect(mockCallback).toHaveBeenCalledTimes(1);

    unmount();

    act(() => div.click());

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });
});
