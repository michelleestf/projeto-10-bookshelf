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
  Book,
  Search,
} from "lucide-react";
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
      } catch (e) {
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
      <h1 className="text-3xl font-bold mb-2 dark:text-gray-100">Dashboard</h1>
      <p className="text-neutral-600 mb-8 text-lg dark:text-gray-400">
        Bem-vindo à sua biblioteca pessoal. Aqui você pode acompanhar seu
        progresso de leitura.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Card className="flex flex-col gap-2 justify-between border border-neutral-200 dark:border-gray-700 shadow-sm dark:bg-gray-900">
          <div className="flex items-center justify-between mb-1">
            <span className="text-base font-semibold text-neutral-800 dark:text-gray-100">
              Total de Livros
            </span>
            <BookOpen size={20} className="text-neutral-400 dark:text-gray-400" />
          </div>
          <div className="text-3xl font-bold dark:text-gray-100">{stats.total}</div>
          <div className="text-xs text-neutral-400 dark:text-gray-400">Em sua biblioteca</div>
        </Card>
        <Card className="flex flex-col gap-2 justify-between border border-neutral-200 dark:border-gray-700 shadow-sm dark:bg-gray-900">
          <div className="flex items-center justify-between mb-1">
            <span className="text-base font-semibold text-neutral-800 dark:text-gray-100">
              Lendo Atualmente
            </span>
            <Users size={20} className="text-neutral-400 dark:text-gray-400" />
          </div>
          <div className="text-3xl font-bold dark:text-gray-100">{stats.lendo}</div>
          <div className="text-xs text-neutral-400 dark:text-gray-400">Livros em progresso</div>
        </Card>
        <Card className="flex flex-col gap-2 justify-between border border-neutral-200 dark:border-gray-700 shadow-sm dark:bg-gray-900">
          <div className="flex items-center justify-between mb-1">
            <span className="text-base font-semibold text-neutral-800 dark:text-gray-100">
              Livros Finalizados
            </span>
            <CheckCircle size={20} className="text-neutral-400 dark:text-gray-400" />
          </div>
          <div className="text-3xl font-bold dark:text-gray-100">{stats.finalizados}</div>
          <div className="text-xs text-neutral-400 dark:text-gray-400">Leituras concluídas</div>
        </Card>
        <Card className="flex flex-col gap-2 justify-between border border-neutral-200 dark:border-gray-700 shadow-sm dark:bg-gray-900">
          <div className="flex items-center justify-between mb-1">
            <span className="text-base font-semibold text-neutral-800 dark:text-gray-100">
              Páginas Lidas
            </span>
            <FileText size={20} className="text-neutral-400 dark:text-gray-400" />
          </div>
          <div className="text-3xl font-bold dark:text-gray-100">{stats.paginas}</div>
          <div className="text-xs text-neutral-400 dark:text-gray-400">Total acumulado</div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="lg:col-span-2">
          <Card className="border border-neutral-200 dark:border-gray-700 shadow-sm dark:bg-gray-900 p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Livros Recentes</h2>
            <div className="flex flex-col gap-3">
              {loading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <BookCardSkeleton key={i} />
                  ))
                : books.map((book: any) => (
                    <BookCard key={book.id} book={book} />
                  ))}
            </div>
          </Card>
        </section>
        <aside>
          <Card className="border border-neutral-200 dark:border-gray-700 shadow-sm dark:bg-gray-900 p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-gray-100">Ações Rápidas</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/adicionar-livros"
                className="flex flex-col items-center gap-1 bg-white border border-neutral-200 dark:bg-gray-900 dark:border-gray-700 hover:bg-neutral-100 dark:hover:bg-gray-800 text-black dark:text-gray-100 rounded-md py-4 font-medium transition"
              >
                <Plus size={22} />
                Adicionar Livro
              </Link>
              <Link
                href="/biblioteca"
                className="flex flex-col items-center gap-1 bg-white border border-neutral-200 dark:bg-gray-900 dark:border-gray-700 hover:bg-neutral-100 dark:hover:bg-gray-800 text-black dark:text-gray-100 rounded-md py-4 font-medium transition"
              >
                <Library size={22} />
                Ver Biblioteca
              </Link>
              <Link
                href="/biblioteca?status=LENDO"
                className="flex flex-col items-center gap-1 bg-white border border-neutral-200 dark:bg-gray-900 dark:border-gray-700 hover:bg-neutral-100 dark:hover:bg-gray-800 text-black dark:text-gray-100 rounded-md py-4 font-medium transition"
              >
                <Book size={22} />
                Lendo Agora
              </Link>
              <Link
                href="/biblioteca"
                className="flex flex-col items-center gap-1 bg-white border border-neutral-200 dark:bg-gray-900 dark:border-gray-700 hover:bg-neutral-100 dark:hover:bg-gray-800 text-black dark:text-gray-100 rounded-md py-4 font-medium transition"
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
