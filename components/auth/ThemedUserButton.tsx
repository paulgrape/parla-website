"use client";

import { UserButton } from "@clerk/nextjs";
import type { ComponentProps } from "react";
import { useClerkAppearance } from "@/hooks/useClerkAppearance";

type ThemedUserButtonProps = ComponentProps<typeof UserButton>;

export function ThemedUserButton(props: ThemedUserButtonProps) {
  const appearance = useClerkAppearance();

  return (
    <UserButton
      {...props}
      appearance={appearance}
      userProfileProps={{ ...props.userProfileProps, appearance }}
    />
  );
}
