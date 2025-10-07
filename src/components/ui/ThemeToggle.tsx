"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <div className="flex items-center"> 
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={dark}
          onChange={() => setDark(!dark)}
          className="sr-only peer"
        />
        {/* Track */}
        <div className="w-14 h-8 bg-secondary rounded-full transition-colors duration-300 peer-checked:bg-secondary" />

        {/* Knob com ícone bonito */}
        <div
          className={`
            absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow-md
            flex items-center justify-center
            transform transition-transform duration-300
            peer-checked:translate-x-6
          `}
        >
          {dark ? <Moon size={16} className="text-black" /> : <Sun size={16}  className="text-black"/>}
        </div>
      </label>
    </div>
  );
}