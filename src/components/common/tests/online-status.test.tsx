import { Mock } from 'vitest';
import useOnlineStatus from '@/common/hooks/use-online-status';

import { render, waitFor } from '@tests/unit/utils/test.util';

import OnlineStatus from '../online-status';

vi.mock('@/common/hooks/use-online-status');

const mockUseOnlineStatus = useOnlineStatus as Mock;

describe('OnlineStatus Component', () => {
  test('should renders online status', async () => {
    mockUseOnlineStatus.mockReturnValue(true);

    const { findByTestId } = render(<OnlineStatus />);

    const onlineStatusElement = await findByTestId('online-status');

    expect(onlineStatusElement).toBeInTheDocument();
    expect(onlineStatusElement).toHaveTextContent('Online');
    waitFor(() => expect(onlineStatusElement).toHaveClass('bg-green-600'));
  });

  test('should renders offline status', async () => {
    mockUseOnlineStatus.mockReturnValue(false);

    const { findByTestId } = render(<OnlineStatus />);

    const onlineStatusElement = await findByTestId('online-status');

    expect(onlineStatusElement).toBeInTheDocument();
    expect(onlineStatusElement).toHaveTextContent('Offline');
    waitFor(() => expect(onlineStatusElement).toHaveClass('bg-red-600'));
  });
});
