import { render } from '@tests/unit/utils/test.util';

import Menu from '../menu';

describe('Menu Component', () => {
  test('should renders the menu', async () => {
    const { findByTestId, findByRole } = render(<Menu />);

    const menuElm = await findByTestId('main-menu');
    const lnkHome = await findByRole('link', { name: /Home/ });
    const lnkPosts = await findByRole('link', { name: /Posts/ });
    const lnkPhotos = await findByRole('link', { name: /Photos/ });
    const lnkAnimations = await findByRole('link', { name: /Animations/ });
    const lnkGames = await findByRole('link', { name: /Game/ });
    const lnkUIKit = await findByRole('link', { name: /UI Kit/ });

    expect(menuElm).toBeInTheDocument();
    expect(lnkHome).toBeInTheDocument();
    expect(lnkHome).toHaveAttribute('href', '/en-us');
    expect(lnkPosts).toBeInTheDocument();
    expect(lnkPosts).toHaveAttribute('href', '/en-us/posts');
    expect(lnkPhotos).toBeInTheDocument();
    expect(lnkPhotos).toHaveAttribute('href', '/en-us/photos');
    expect(lnkAnimations).toBeInTheDocument();
    expect(lnkAnimations).toHaveAttribute('href', '/en-us/animations');
    expect(lnkGames).toBeInTheDocument();
    expect(lnkGames).toHaveAttribute('href', '/en-us/game');
    expect(lnkUIKit).toBeInTheDocument();
    expect(lnkUIKit).toHaveAttribute('href', '/en-us/ui');
  });
});
