import { useAuthState } from '@/modules/auth/states/auth.state';

import { act, fireEvent, render } from '@tests/unit/utils/test.util';

import OAuthGoogleSignInButton from '../oauth-google-sign-in-button';

vi.mock('@/modules/auth/states/auth.state', () => ({
  useAuthState: vi.fn().mockReturnValue({
    googleSignIn: vi.fn()
  })
}));

describe('OAuthGoogleSignInButton Component', () => {
  test('should renders with the correct text', async () => {
    const { findByTestId } = render(<OAuthGoogleSignInButton />);

    const btnElm = await findByTestId('btn-signin-google');

    expect(btnElm).toBeInTheDocument();
  });

  test('should calls the googleSignIn function on button click', async () => {
    const { findByTestId } = render(<OAuthGoogleSignInButton />);

    const btnElm = await findByTestId('btn-signin-google');

    act(() => {
      fireEvent.click(btnElm);
    });

    expect(btnElm).toBeInTheDocument();
    expect(useAuthState().googleSignIn).toHaveBeenCalledWith({
      redirect: true,
      callbackUrl: '/'
    });
  });
});
