import { vi } from 'vitest';

export default vi.fn();
export const SessionProvider = vi.fn().mockImplementation(({ children }) => children);
export const getSession = vi.fn();
export const useSession = vi.fn();
export const signIn = vi.fn();
export const signOut = vi.fn();
