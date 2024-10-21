import NotFoundPage from '@/app/[locale]/(error)/not-found';

import { pageParams } from '@tests/unit/constants';
import { render } from '@tests/unit/utils/test.util';

describe('NotFound Page', () => {
  test('should renders the page', async () => {
    const { findByText } = render(await NotFoundPage(pageParams));

    const content = await findByText('404');

    expect(content).toBeInTheDocument();
  });

  // test('should calls generateMetadata function', async () => {
  //   const metadata = await generateMetadata(pageParams);

  //   expect(metadata).toEqual({ title: 'NotFound', description: 'NotFound Description' });
  // });
});
