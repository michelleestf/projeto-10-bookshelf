import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-white p-6 shadow-sm dark:bg-gray-900 dark:border-gray-700",
        className
      )}
    >
      {children}
    </div>
  );
}
