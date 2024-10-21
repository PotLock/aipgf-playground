import { vi } from 'vitest';

export default vi.fn();
export const useRouter = vi.fn().mockReturnValue({
  push: vi.fn()
});

export const usePathname = vi.fn();
export const useSearchParams = vi.fn(() => ({
  get: vi.fn()
}));
