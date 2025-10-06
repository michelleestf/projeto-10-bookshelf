import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
}

export function Button({
  variant = "default",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
        variant === "default" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "outline" &&
        "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
        variant === "ghost" && "bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground",
        variant === "destructive" && "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        className
      )}
      {...props}
    />
  );
}
