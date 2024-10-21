import { Session, User } from 'next-auth';

import { useAuthState } from '@/modules/auth/states/auth.state';

import { act, fireEvent, render, screen } from '@tests/unit/utils/test.util';

import Authenticated from '../authenticated';

const mockUseAuthState = {
  signOut: vi.fn()
};

vi.mock('@/modules/auth/states/auth.state', () => ({
  useAuthState: () => mockUseAuthState
}));

describe('Authenticated Component', () => {
  beforeEach(() => {
    mockUseAuthState.signOut.mockClear();
  });

  const session: Session = {
    user: {
      id: 'user-id',
      name: 'Company',
      email: 'hello@email.com',
      image: ''
    } as User,
    accessToken: 'access_token',
    expires: '2025-10-10T10:10:10.000Z'
  };

  test('should not renders the component if userSession is null', async () => {
    render(<Authenticated userSession={null} />);

    const main = screen.queryByTestId('authenticated');

    expect(main).toBeNull();
  });

  test('should renders the component with user information', async () => {
    const { findByTestId, findByRole } = render(<Authenticated userSession={session} />);

    const strong = await findByTestId('username');
    const btnSignOut = await findByRole('button');

    expect(strong).toBeInTheDocument();
    expect(strong).toHaveTextContent('Company');
    expect(btnSignOut).toBeInTheDocument();
  });

  test('should calls the logout function', async () => {
    const { findByRole } = render(<Authenticated userSession={session} />);

    const btnSignOut = await findByRole('button');

    act(() => {
      fireEvent.click(btnSignOut);
    });

    expect(btnSignOut.innerHTML).toBe('signout');
    expect(useAuthState().signOut).toHaveBeenCalledTimes(1);
    expect(useAuthState().signOut).toHaveBeenCalledWith({
      redirect: true,
      callbackUrl: '/'
    });
  });
});
