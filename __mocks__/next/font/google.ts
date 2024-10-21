import { vi } from 'vitest';

export default vi.fn();
export const Mulish = vi.fn().mockReturnValue({
  subsets: ['vietnamese'],
  variable: '--font-nunito',
  display: 'swap',
  weight: ['400', '700']
});
export const Roboto = vi.fn().mockReturnValue({
  subsets: ['vietnamese'],
  variable: '--font-roboto',
  display: 'swap',
  weight: ['700']
});
