import NextAuth from 'next-auth';

import { handlers } from '@/modules/auth/constants/auth.config';

export const { GET, POST } = handlers;
