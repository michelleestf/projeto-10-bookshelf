import { BookOpen, Home, Library, Plus } from "lucide-react";
import { ThemeSelector } from "@/components/ui/ThemeSelector";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-xl"
        >
          <BookOpen size={28} className="text-foreground" />
          <span>BookShelf</span>
        </Link>

         <div className="flex items-center gap-4">
          <nav className="flex items-center gap-8 text-sm font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home size={18} className="text-muted-foreground" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
              href="/biblioteca"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Library size={18} className="text-muted-foreground" />
              <span className="hidden sm:inline">Biblioteca</span>
            </Link>
            <Link
              href="/adicionar-livros"
              className="ml-4 bg-primary text-primary-foreground px-4 py-2 rounded-md font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Plus size={18} className="text-primary-foreground" />
              <span className="hidden sm:inline">Adicionar Livro</span>
            </Link>
          </nav>
          <ThemeSelector />
        </div>
      </div>
    </header>
  );
}