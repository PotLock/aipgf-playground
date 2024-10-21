import { useRouter } from 'next/navigation';

import { act, fireEvent, render } from '@tests/unit/utils/test.util';

import Unauthenticated from '../unauthenticated';

vi.mock('next/navigation', () => ({
  useRouter: vi.fn().mockReturnValue({
    push: vi.fn()
  })
}));

describe('Unauthenticated Component', () => {
  test('should not renders the component if visible is false', async () => {
    const { queryByTestId } = render(<Unauthenticated />);

    const main = queryByTestId('unauthenticated');

    expect(main).not.toBeInTheDocument();
  });

  test('should renders the component if visible is true', async () => {
    const { findByTestId } = render(<Unauthenticated visible={true} />);

    const btnSignIn = await findByTestId('btn-signin');

    expect(btnSignIn).toBeInTheDocument();
  });

  test('should navigate to LOGIN route when Sign In button is clicked', async () => {
    const { findByTestId } = render(<Unauthenticated visible={true} />);

    const btnSignIn = await findByTestId('btn-signin');

    expect(btnSignIn.innerHTML).toBe('signin');

    act(() => {
      fireEvent.click(btnSignIn);
    });

    expect(useRouter().push).toHaveBeenCalledWith({ pathname: '/login' });
  });
});
