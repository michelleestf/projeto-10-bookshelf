"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-4 w-4" />;
      case "dark":
        return <Moon className="h-4 w-4" />;
      case "system":
        return <Monitor className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const [open, setOpen] = React.useState(false);
  if (!mounted) return null;
  return (
    <>
      {/* Mobile: only icon, custom dropdown */}
      <span className="sm:hidden" style={{ position: "relative" }}>
        <button
          aria-label="Selecionar tema"
          className="p-0 m-0 bg-transparent border-none shadow-none flex items-center justify-center focus:outline-none focus:ring-0"
          style={{ width: "auto", minWidth: 0, boxShadow: "none" }}
          onClick={() => setOpen((v) => !v)}
        >
          {getThemeIcon()}
        </button>
        {open && (
          <div className="absolute right-2 top-8 z-50 min-w-[120px] rounded-md bg-popover p-2 shadow-lg border border-border flex flex-col gap-1">
            <button
              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent"
              onClick={() => {
                setTheme("light");
                setOpen(false);
              }}
            >
              <Sun className="h-4 w-4" />
              <span>Light</span>
            </button>
            <button
              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent"
              onClick={() => {
                setTheme("dark");
                setOpen(false);
              }}
            >
              <Moon className="h-4 w-4" />
              <span>Dark</span>
            </button>
            <button
              className="flex items-center gap-2 px-2 py-1 rounded hover:bg-accent"
              onClick={() => {
                setTheme("system");
                setOpen(false);
              }}
            >
              <Monitor className="h-4 w-4" />
              <span>System</span>
            </button>
          </div>
        )}
      </span>
      {/* Desktop: icon + label + select */}
      <span className="hidden sm:inline">
        <Select value={theme} onValueChange={setTheme}>
          <SelectTrigger className="w-[140px] border-0 bg-transparent hover:bg-accent hover:text-accent-foreground transition-colors">
            <div className="flex items-center gap-2">
              {getThemeIcon()}
              <SelectValue placeholder="Tema">
                {theme === "light"
                  ? "Light"
                  : theme === "dark"
                  ? "Dark"
                  : "System"}
              </SelectValue>
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">
              <div className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                <span>Light</span>
              </div>
            </SelectItem>
            <SelectItem value="dark">
              <div className="flex items-center gap-2">
                <Moon className="h-4 w-4" />
                <span>Dark</span>
              </div>
            </SelectItem>
            <SelectItem value="system">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                <span>System</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </span>
    </>
  );
}
