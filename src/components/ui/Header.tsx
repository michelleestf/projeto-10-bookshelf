import { BookOpen, Home, Library, Plus } from "lucide-react";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b bg-white sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <BookOpen size={28} className="text-black" />
          <span>BookShelf</span>
        </Link>
        <nav className="flex items-center gap-8 text-sm font-medium">
          <Link
            href="/"
            className="flex items-center gap-2 text-neutral-700 hover:text-black"
          >
            <Home size={18} className="text-neutral-500" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
          <Link
            href="/biblioteca"
            className="flex items-center gap-2 text-neutral-700 hover:text-black"
          >
            <Library size={18} className="text-neutral-500" />
            <span className="hidden sm:inline">Biblioteca</span>
          </Link>
          <Link
            href="/novo"
            className="ml-4 bg-black text-white px-4 py-2 rounded-md font-semibold hover:bg-neutral-800 transition flex items-center gap-2"
          >
            <Plus size={18} className="text-white" />
            <span className="hidden sm:inline">Adicionar Livro</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
