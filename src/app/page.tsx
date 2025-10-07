"use client";
import React from "react";
import { Card } from "@/components/ui/Card";
import { BookCard } from "@/components/ui/BookCard";
import BookCardSkeleton from "@/components/ui/BookCardSkeleton";
import Link from "next/link";

import {
  BookOpen,
  Users,
  CheckCircle,
  FileText,
  Plus,
  Library,
  Search,
  Book as BookIcon,
} from "lucide-react";
import type { Book as BookType } from "@/lib/books";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [books, setBooks] = React.useState([]);
  const [stats, setStats] = React.useState({
    total: 0,
    lendo: 0,
    finalizados: 0,
    paginas: 0,
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      try {
        const res = await fetch("/api/books/dashboard");
        const data = await res.json();
        setBooks(data.recentes || []);
        setStats(
          data.stats || { total: 0, lendo: 0, finalizados: 0, paginas: 0 }
        );
      } catch {
        setBooks([]);
        setStats({ total: 0, lendo: 0, finalizados: 0, paginas: 0 });
        toast.error("Erro ao carregar o dashboard.");
      }
      setLoading(false);
    }
    fetchDashboard();
  }, []);
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2 text-foreground">Dashboard</h1>
      <p className="text-muted-foreground mb-8 text-lg">
        Bem-vindo à sua biblioteca pessoal. Aqui você pode acompanhar seu
        progresso de leitura.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Card className="flex flex-col gap-2 justify-between shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-base font-semibold text-card-foreground">
              Total de Livros
            </span>
            <BookOpen size={20} className="text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold text-card-foreground">
            {stats.total}
          </div>
          <div className="text-xs text-muted-foreground">Em sua biblioteca</div>
        </Card>
        <Card className="flex flex-col gap-2 justify-between shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-base font-semibold text-card-foreground">
              Lendo Atualmente
            </span>
            <Users size={20} className="text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold text-card-foreground">
            {stats.lendo}
          </div>
          <div className="text-xs text-muted-foreground">
            Livros em progresso
          </div>
        </Card>
        <Card className="text-base font-semibold text-card-foreground">
          <div className="flex items-center justify-between mb-1">
            <span className="text-base font-semibold text-card-foreground">
              Livros Finalizados
            </span>
            <CheckCircle size={20} className="text-neutral-400" />
          </div>
          <div className="text-3xl font-bold">{stats.finalizados}</div>
          <div className="text-xs text-neutral-400">Leituras concluídas</div>
        </Card>
        <Card className="flex flex-col gap-2 justify-between shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-base font-semibold text-card-foreground">
              Páginas Lidas
            </span>
            <FileText size={20} className="text-muted-foreground" />
          </div>
          <div className="text-3xl font-bold">{stats.paginas}</div>
          <div className="text-xs text-muted-foreground">Total acumulado</div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2">
          <Card className="shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4 text-card-foreground">
              Livros Recentes
            </h2>
            <div className="flex flex-col gap-3">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <BookCardSkeleton key={i} />
                  ))
                : (books as BookType[]).map((book) => (
                    <BookCard key={book.id} book={book} />
                  ))}
            </div>
          </Card>
        </section>
        <aside>
          <Card className="shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/adicionar-livros"
                className="flex flex-col items-center gap-1 bg-card border border-border hover:bg-accent hover:text-accent-foreground text-card-foreground rounded-md py-4 font-medium transition-colors"
              >
                <Plus size={22} />
                Adicionar Livro
              </Link>
              <Link
                href="/biblioteca"
                className="flex flex-col items-center gap-1 bg-card border border-border hover:bg-accent hover:text-accent-foreground text-card-foreground rounded-md py-4 font-medium transition-colors"
              >
                <Library size={22} />
                Ver Biblioteca
              </Link>
              <Link
                href="/biblioteca?status=LENDO"
                className="flex flex-col items-center gap-1 bg-card border border-border hover:bg-accent hover:text-accent-foreground text-card-foreground rounded-md py-4 font-medium transition-colors"
              >
                <BookIcon size={22} />
                Lendo Agora
              </Link>
              <Link
                href="/biblioteca"
                className="flex flex-col items-center gap-1 bg-card border border-border hover:bg-accent hover:text-accent-foreground text-card-foreground rounded-md py-4 font-medium transition-colors"
              >
                <Search size={22} />
                Buscar Livros
              </Link>
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}
