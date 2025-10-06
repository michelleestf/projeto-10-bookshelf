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
        "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
        variant === "default" &&
          "bg-black text-white hover:bg-neutral-800 dark:bg-gray-100 dark:text-black dark:hover:bg-gray-300",
        variant === "outline" &&
          "border border-neutral-300 bg-white text-black hover:bg-neutral-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:hover:bg-gray-800",
        variant === "ghost" &&
          "bg-transparent text-black hover:bg-neutral-100 dark:text-gray-100 dark:hover:bg-gray-800",
        variant === "destructive" &&
          "bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:text-white dark:hover:bg-red-800",
        className
      )}
      {...props}
    />
  );
}
