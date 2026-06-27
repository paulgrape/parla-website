"use client";

import { ClerkProvider } from "@clerk/nextjs";

function hasValidClerkKey() {
  const key = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  return Boolean(key && key.startsWith("pk_") && !key.includes("placeholder"));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  if (!hasValidClerkKey()) {
    return <>{children}</>;
  }

  return <ClerkProvider>{children}</ClerkProvider>;
}
