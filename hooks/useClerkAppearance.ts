"use client";

import { useEffect, useMemo, useState } from "react";
import { dark } from "@clerk/themes";
import type { Appearance } from "@clerk/types";
import { useTheme } from "next-themes";

const brandVariables = {
  colorPrimary: "#58cc02",
  colorDanger: "#ff4b4b",
  borderRadius: "1rem",
} as const;

function buildClerkAppearance(resolvedTheme: string | undefined): Appearance {
  if (resolvedTheme === "dark") {
    return {
      baseTheme: dark,
      variables: brandVariables,
    };
  }

  return {
    variables: brandVariables,
  };
}

export function useClerkAppearance(): Appearance | undefined {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return useMemo(() => {
    if (!mounted) return undefined;
    return buildClerkAppearance(resolvedTheme);
  }, [mounted, resolvedTheme]);
}
