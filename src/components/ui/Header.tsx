import { BookOpen, Home, Library, Plus } from "lucide-react";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 sticky top-0 z-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl text-gray-900 dark:text-gray-100 transition-colors"
        >
          <BookOpen size={28} className="text-gray-900 dark:text-gray-100" />
          <span>BookShelf</span>
        </Link>

        <nav className="flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className="flex items-center gap-2 text-neutral-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            <Home size={18} className="text-neutral-500 dark:text-gray-400" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <Link
            href="/biblioteca"
            className="flex items-center gap-2 text-neutral-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors"
          >
            <Library size={18} className="text-neutral-500 dark:text-gray-400" />
            <span className="hidden sm:inline">Biblioteca</span>
          </Link>

          <Link
            href="/adicionar-livros"
            className="ml-4 bg-black dark:bg-gray-100 text-white dark:text-gray-900 px-4 py-2 rounded-md font-semibold hover:bg-neutral-800 dark:hover:bg-gray-300 transition flex items-center gap-2"
          >
            <Plus size={18} className="text-white dark:text-gray-900" />
            <span className="hidden sm:inline">Adicionar Livro</span>
          </Link>

          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}