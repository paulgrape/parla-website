import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-bold uppercase tracking-wide transition-all disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-dark shadow-[0_4px_0_0_#46a302] active:shadow-none active:translate-y-1",
        outline: "border-2 border-border bg-white hover:bg-muted",
        ghost: "hover:bg-muted",
        destructive: "bg-destructive text-white shadow-[0_4px_0_0_#cc0000] active:shadow-none active:translate-y-1",
      },
      size: {
        default: "h-12 px-6 rounded-2xl text-sm",
        sm: "h-10 px-4 rounded-xl text-xs",
        lg: "h-14 px-8 rounded-2xl text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size, className }))} {...props} />
  );
}
