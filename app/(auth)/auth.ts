import { compare } from 'bcrypt-ts';
import NextAuth, { Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUser } from '@/db/queries';

import { authConfig } from './auth.config';

export interface User {
  id?: string;
  name?: string | null;
  username?: string | null;
  image?: string | null;
}
interface ExtendedSession extends Session {
  user: User;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ username, password }: any) {
        let users = await getUser(username);
        if (users.length === 0) return null;
        let passwordsMatch = await compare(password, users[0].password!);
        if (passwordsMatch) return users[0] as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: User }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }

      return session;
    },
  },
});
