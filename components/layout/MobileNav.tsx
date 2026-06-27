"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Learn", icon: Home },
  { href: "/review", label: "Review", icon: RotateCcw },
];

export function MobileNav() {
  const pathname = usePathname();

  // Immersive lesson flow: hide the nav while inside a lesson.
  if (pathname.startsWith("/lesson/")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t-2 border-border bg-white md:hidden">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + "/");
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-3 text-xs font-bold transition-colors",
              active ? "text-primary" : "text-muted-foreground"
            )}
          >
            <Icon className="h-6 w-6" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
