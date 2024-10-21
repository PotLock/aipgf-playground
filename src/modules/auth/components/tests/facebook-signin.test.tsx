import { useAuthState } from '@/modules/auth/states/auth.state';

import { act, fireEvent, render } from '@tests/unit/utils/test.util';

import OAuthFacebookSignInButton from '../oauth-facebook-sign-in-button';

vi.mock('@/modules/auth/states/auth.state', () => ({
  useAuthState: vi.fn().mockReturnValue({
    facebookSignIn: vi.fn()
  })
}));

describe('OAuthFacebookSignInButton Component', () => {
  test('should renders with the correct text', async () => {
    const { findByTestId } = render(<OAuthFacebookSignInButton />);

    const btnElm = await findByTestId('btn-signin-facebook');

    expect(btnElm).toBeInTheDocument();
  });

  test('should calls the facebookSignIn function on button click', async () => {
    const { findByTestId } = render(<OAuthFacebookSignInButton />);

    const btnElm = await findByTestId('btn-signin-facebook');

    act(() => {
      fireEvent.click(btnElm);
    });

    expect(btnElm).toBeInTheDocument();
    expect(useAuthState().facebookSignIn).toHaveBeenCalledWith({
      redirect: true,
      callbackUrl: '/'
    });
  });
});
