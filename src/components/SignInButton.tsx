"use client";

import { signIn } from "next-auth/react";

export default function SignInButton() {
  return (
    <button
      onClick={() => signIn("google")}
      className="text-sm uppercase tracking-[0.1em] pb-0.5 border-b cursor-pointer transition-opacity hover:opacity-70"
      style={{
        color: "var(--accent)",
        borderColor: "var(--accent)",
      }}
    >
      Sign in with Google
    </button>
  );
}
