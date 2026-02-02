import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}

export interface ParsedEvent {
  title: string;
  date: Date | null;
  startTime: Date | null;
  endTime: Date | null;
  durationMs: number | null;
  isValid: boolean;
  rawText: string;
}
