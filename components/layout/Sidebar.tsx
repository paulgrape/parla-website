"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Flame, Home, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  streak: number;
  xp: number;
}

export function Sidebar({ streak, xp }: SidebarProps) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard", label: "Learn", icon: Home },
    { href: "/review", label: "Review", icon: RotateCcw },
  ];

  return (
    <aside className="hidden md:flex w-64 flex-col border-r-2 border-border bg-white p-6 gap-8">
      <div>
        <h1 className="text-2xl font-black text-primary tracking-tight">Parla</h1>
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
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="flex items-center gap-3 rounded-2xl bg-orange-50 px-4 py-3">
          <Flame className="h-6 w-6 text-orange-500" />
          <div>
            <p className="text-xs font-bold uppercase text-orange-600">Streak</p>
            <p className="text-xl font-black text-orange-500">{streak} days</p>
          </div>
        </div>
        <div className="rounded-2xl bg-primary/10 px-4 py-3">
          <p className="text-xs font-bold uppercase text-primary">Total XP</p>
          <p className="text-xl font-black text-primary">{xp}</p>
        </div>
      </div>
    </aside>
  );
}
