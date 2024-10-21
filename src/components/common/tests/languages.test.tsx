import { render } from '@tests/unit/utils/test.util';

import Languages from '../languages';

describe('Languages Component', () => {
  test('should renders the languages', async () => {
    const { findByTestId } = render(<Languages />);

    const vivnFlag = await findByTestId('vi-vn-flag');
    const enusFlag = await findByTestId('en-us-flag');

    expect(vivnFlag).toBeInTheDocument();
    expect(enusFlag).toBeInTheDocument();
    expect(vivnFlag).toHaveAttribute('href', '/vi-vn');
    expect(enusFlag).toHaveAttribute('href', '/en-us');
  });
});
