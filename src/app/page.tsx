import { initialBooks } from "@/lib/books";
import { Card } from "@/components/ui/card";
import { BookCard } from "@/components/ui/BookCard";

import {
  BookOpen,
  Users,
  CheckCircle,
  FileText,
  Plus,
  Library,
  Book,
  Search,
  Link,
} from "lucide-react";

function getStats() {
  const total = initialBooks.length;
  const lendo = initialBooks.filter((b) => b.status === "LENDO").length;
  const finalizados = initialBooks.filter((b) => b.status === "LIDO").length;
  const paginas = initialBooks.reduce((acc, b) => acc + (b.pages || 0), 0);
  return { total, lendo, finalizados, paginas };
}

export default function Dashboard() {
  const stats = getStats();
  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
      <p className="text-neutral-600 mb-8 text-lg">
        Bem-vindo à sua biblioteca pessoal. Aqui você pode acompanhar seu
        progresso de leitura.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <Card className="flex flex-col gap-2 justify-between border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-base font-semibold text-neutral-800">
              Total de Livros
            </span>
            <BookOpen size={20} className="text-neutral-400" />
          </div>
          <div className="text-3xl font-bold">{stats.total}</div>
          <div className="text-xs text-neutral-400">Em sua biblioteca</div>
        </Card>
        <Card className="flex flex-col gap-2 justify-between border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-base font-semibold text-neutral-800">
              Lendo Atualmente
            </span>
            <Users size={20} className="text-neutral-400" />
          </div>
          <div className="text-3xl font-bold">{stats.lendo}</div>
          <div className="text-xs text-neutral-400">Livros em progresso</div>
        </Card>
        <Card className="flex flex-col gap-2 justify-between border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-base font-semibold text-neutral-800">
              Livros Finalizados
            </span>
            <CheckCircle size={20} className="text-neutral-400" />
          </div>
          <div className="text-3xl font-bold">{stats.finalizados}</div>
          <div className="text-xs text-neutral-400">Leituras concluídas</div>
        </Card>
        <Card className="flex flex-col gap-2 justify-between border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-base font-semibold text-neutral-800">
              Páginas Lidas
            </span>
            <FileText size={20} className="text-neutral-400" />
          </div>
          <div className="text-3xl font-bold">{stats.paginas}</div>
          <div className="text-xs text-neutral-400">Total acumulado</div>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2">
          <Card className="border border-neutral-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Livros Recentes</h2>
            <div className="flex flex-col gap-3">
              {initialBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </Card>
        </section>
        <aside>
          <Card className="border border-neutral-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link href="./adicionar-livros">
               <button className="flex flex-col items-center gap-1 bg-white border border-neutral-200 hover:bg-neutral-100 text-black rounded-md py-4 font-medium transition">
                <Plus size={22} />
                Adicionar Livro
              </button>
              </Link>
              <button className="flex flex-col items-center gap-1 bg-white border border-neutral-200 hover:bg-neutral-100 text-black rounded-md py-4 font-medium transition">
                <Library size={22} />
                Ver Biblioteca
              </button>
              <button className="flex flex-col items-center gap-1 bg-white border border-neutral-200 hover:bg-neutral-100 text-black rounded-md py-4 font-medium transition">
                <Book size={22} />
                Lendo Agora
              </button>
              <button className="flex flex-col items-center gap-1 bg-white border border-neutral-200 hover:bg-neutral-100 text-black rounded-md py-4 font-medium transition">
                <Search size={22} />
                Buscar Livros
              </button>
            </div>
          </Card>
        </aside>
      </div>
    </main>
  );
}
