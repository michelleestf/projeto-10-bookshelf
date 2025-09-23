import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  color?: "default" | "success" | "warning" | "danger" | "info" | "muted";
  className?: string;
}

const colorMap = {
  default: "bg-neutral-200 text-neutral-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  danger: "bg-red-100 text-red-800",
  info: "bg-blue-100 text-blue-700",
  muted: "bg-neutral-100 text-neutral-500",
};

export function Badge({ children, color = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-xs font-semibold",
        colorMap[color],
        className
      )}
    >
      {children}
    </span>
  );
}
