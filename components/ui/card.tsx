import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-3xl border-2 border-border bg-card p-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}
