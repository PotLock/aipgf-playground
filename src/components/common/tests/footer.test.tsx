import { render } from '@tests/unit/utils/test.util';

import Footer from '../footer';

describe('Footer Component', () => {
  test('should renders the footer', async () => {
    const { findByTestId } = render(<Footer />);

    const contentElm = await findByTestId('content');
    const linkElm = await findByTestId('link');

    expect(contentElm).toBeInTheDocument();
    expect(contentElm).toHaveTextContent('Website được thiết kế bởi Công Ty TNHH Giải Pháp Phần Mềm');
    expect(linkElm).toBeInTheDocument();
    expect(linkElm).toHaveAttribute('href', '#');
    expect(linkElm).toHaveAttribute('target', '_blank');
    expect(linkElm).toHaveAttribute('rel', 'noreferrer');
  });
});
