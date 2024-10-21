import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { kv } from '@vercel/kv';
import { z } from 'zod';

interface User {
  id: string;
  username: string;
  password: string;
}

// Add this function to generate a unique ID

export const authConfig = {
  pages: {
    signIn: '/login'
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: []
} satisfies NextAuthConfig;
async function getUser(username: string): Promise<User | null> {
  const user = await kv.hgetall(`user:${username}`);
  return user as User | null;
}

export const authOptions = {
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            username: z.string().min(6),
            password: z.string().min(6)
          })
          .safeParse(credentials);
        if (parsedCredentials.success) {
          const { username, password } = parsedCredentials.data;
          const user = await getUser(username);

          if (!user) {
            console.log('User not found');
            return null;
          }

          // Decode the stored password and compare
          const decodedPassword = user.password;
          const isPasswordValid = password === decodedPassword;
          if (!isPasswordValid) {
            console.log('password', password);

            console.log('decodedPassword', decodedPassword);
            console.log('Invalid password');
            return null;
          }

          console.log('Authentication successful');
          return {
            id: user.id,
            username: user.username
          } as any;
        }
        return null;
      }
    })
  ]
};

export const { auth, signIn, signOut, handlers } = NextAuth(authOptions);
