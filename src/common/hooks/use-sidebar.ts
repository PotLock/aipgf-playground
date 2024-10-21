import { useParams, useSearchParams } from 'next/navigation';

import { usePathname, useRouter } from 'next/navigation';

export default function useSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const query = Object.fromEntries(searchParams);
  const isExpanded = searchParams.get('sidebar') === 'opened';

  const toggle = () => {
    if (searchParams.get('sidebar') === 'opened') {
      query.sidebar = 'closed';
    } else {
      query.sidebar = 'opened';
    }
    router.push(
      // @ts-expect-error -- TypeScript will validate that only known `params`
      { pathname, params, query }
    );
  };

  return { isExpanded, toggle };
}
