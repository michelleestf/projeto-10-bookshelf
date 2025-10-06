import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  color?: "default" | "success" | "warning" | "danger" | "info" | "muted";
  className?: string;
}

const colorMap = {
  default: "bg-neutral-200 text-neutral-800 dark:bg-gray-900 dark:text-gray-100",
  success: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
  warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100",
  danger: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100",
  muted: "bg-neutral-100 text-neutral-500 dark:bg-gray-900 dark:text-gray-400",
};

export function Badge({ children, color = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-semibold transition-colors",
        colorMap[color],
        className
      )}
    >
      {children}
    </span>
  );
}