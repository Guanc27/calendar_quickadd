"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut()}
      className="text-xs uppercase tracking-[0.1em] cursor-pointer transition-opacity hover:opacity-70"
      style={{ color: "var(--text-muted)" }}
    >
      Sign out
    </button>
  );
}
