declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_SITE_URL: string;
    NEXT_PUBLIC_MESSENGER_PAGE_ID: string;
    NEXT_PUBLIC_GOOGLE_TRACKING: string;
    NEXT_PUBLIC_SEGMENT_TRACKING: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_EXPIRES_IN: string;
    FACEBOOK_CLIENT_ID: string;
    FACEBOOK_CLIENT_SECRET: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: string;
    NEXT_PUBLIC_VERCEL_URL: string;
    NEXT_PUBLIC_API_KEY_NODIT: string;
    AUTH_GOOGLE_ID: string;
    AUTH_GOOGLE_SECRET: string;
  }
}
