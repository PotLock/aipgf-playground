import { vi } from 'vitest';

export default vi.fn();
export const useQuery = vi.fn(() => ({
  push: vi.fn()
}));

export const QueryClient = vi.fn();
