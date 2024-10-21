import { ResponseFormat } from '@/common/interfaces/api-response.interface';
import { SignInOptions } from 'next-auth/react';

export type AuthEntity = {
  user: {
    id: string;
    username: string;
    password: string;
  };
  accessToken: string;
};

export type RefreshTokenEntity = {
  accessToken: string;
};

export type SignInDto = {
  email: string;
  password: string;
} & SignInOptions;

export type SignUpDto = {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
};

export type ForgotPasswordDto = {
  email: string;
};

export type ResetPasswordDto = {
  otpCode: string;
  password: string;
  confirmPassword: string;
};

export type SignInResponse = ResponseFormat<AuthEntity>;
export type SignOutResponse = ResponseFormat<{ status: string }>;
export type SignUpResponse = ResponseFormat<{ email: string }>;
export type ForgotPasswordResponse = ResponseFormat<{ code: string }>;
export type RefreshTokenResponse = ResponseFormat<RefreshTokenEntity>;
