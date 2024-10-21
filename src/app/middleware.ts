import NextAuth from 'next-auth';
import { authOptions } from '@/modules/auth/constants/auth.constant';

export default NextAuth(authOptions).auth;

export const config = {
  // Skip all paths that should not be internationalized. This example skips
  // certain folders and all pathnames with a dot (e.g. favicon.ico)
  matcher: ['/((?!api|_next|_vercel|sitemap.xml|sitemap-[\\d].xml|.*\\..*).*)']
};
