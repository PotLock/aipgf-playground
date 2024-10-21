import { render } from '@tests/unit/utils/test.util';

import NoSsr from '../no-ssr';

describe('NoSsr Component', () => {
  it('should render children without server-side rendering', async () => {
    const { findByText } = render(<NoSsr>{<div>Test Children</div>}</NoSsr>);

    const elm = await findByText('Test Children');

    expect(elm).toBeInTheDocument();
  });
});
