import Credentials from 'next-auth/providers/credentials';
import { kv } from '@vercel/kv';
import { z } from 'zod';
import { authConfig } from './auth.config';

interface User {
  id: string;
  username: string;
  password: string;
}

// Add this function to generate a unique ID
function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

async function getUser(username: string): Promise<User | null> {
  const user = await kv.hgetall(`user:${username}`);
  return user as User | null;
}

export async function registerUser(username: string, password: string): Promise<User | null> {
  try {
    // Check if the username already exists
    const existingUser = await kv.hgetall(`user:${username}`);
    if (existingUser) {
      console.log(`Username ${username} already exists`);
      return null;
    }

    // Encode the password using btoa
    const encodedPassword = btoa(password);

    // Create a new user object
    const newUser: User = {
      id: generateUniqueId(),
      username,
      password: encodedPassword
    };

    // Store the new user in the KV database
    await kv.hmset(`user:${username}`, newUser as any);

    console.log(`User ${username} registered successfully`);
    return newUser;
  } catch (error) {
    console.error('Error registering user:', error);
    return null;
  }
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
