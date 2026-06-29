"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home01Icon, ArrowReloadHorizontalIcon } from "hugeicons-react";
import { ThemedUserButton } from "@/components/auth/ThemedUserButton";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Learn", icon: Home01Icon },
  { href: "/review", label: "Review", icon: ArrowReloadHorizontalIcon },
];

export function Sidebar() {
  const pathname = usePathname();

  // Immersive lesson flow: hide the sidebar while inside a lesson.
  if (pathname.startsWith("/lesson/")) return null;

  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-8 border-r-2 border-border bg-card p-6 md:flex">
      <div>
        <h1 className="text-2xl font-black tracking-tight text-primary font-display">Parla</h1>
        <p className="text-sm text-muted-foreground">Learn Italian</p>
      </div>

      <nav className="flex flex-col gap-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition-colors",
              pathname === href || pathname.startsWith(href + "/")
                ? "bg-primary/10 text-primary"
                : "text-foreground hover:bg-muted"
            )}
          >
            <Icon size={20} strokeWidth={2} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto flex items-center justify-between rounded-2xl px-2 py-2">
        <div className="flex items-center gap-3">
          <ThemedUserButton afterSignOutUrl="/sign-in" />
          <span className="text-sm font-bold text-muted-foreground">Account</span>
        </div>
        <ThemeToggle />
      </div>
    </aside>
  );
}
