"use client";

import { use } from "react";
import { useState } from "react";
import { initialBooks, Book } from "@/lib/books";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import NotFound from "@/components/ui/NotFound";

const statusMap = {
  QUERO_LER: { label: "Quero Ler", color: "default" },
  LENDO: { label: "Lendo", color: "success" },
  LIDO: { label: "Lido", color: "default" },
  PAUSADO: { label: "Pausado", color: "warning" },
  ABANDONADO: { label: "Abandonado", color: "danger" },
} as const;

export default function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: rawId } = use(params);
  const id = Array.isArray(rawId) ? rawId[0] : rawId;

  const [books, setBooks] = useState<Book[]>(initialBooks);
  const router = useRouter();

  const book = books.find((b) => b.id === id);
  if (!book)
    return (
      <NotFound message="O livro que você está tentando acessar não existe ou foi removido." />
    );

  const handleDelete = () => {
    if (confirm("Deseja excluir este livro?")) {
      setBooks((prev) => prev.filter((b) => b.id !== book.id));
      router.push("/biblioteca");
    }
  };

  const handleEdit = () => {
    const newTitle = prompt("Editar título do livro:", book.title);
    if (newTitle && newTitle.trim() !== "") {
      setBooks((prev) =>
        prev.map((b) => (b.id === book.id ? { ...b, title: newTitle } : b))
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold mb-2">Detalhes do Livro</h1>
        <Link
          href="/biblioteca"
          className="text-sm text-neutral-500 hover:text-black flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Voltar para biblioteca
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Capa dos livros */}
        <div className="w-[220px] h-[320px] flex-shrink-0">
          <Image
            src={
              book.cover || "https://covers.openlibrary.org/b/id/10909258-L.jpg"
            }
            alt={book.title}
            width={220}
            height={320}
            className="rounded-lg object-cover border w-[220px] h-[320px]"
          />
        </div>

        {/* Informações do livro */}
        <div className="flex-1">
          <h2 className="text-3xl font-bold mb-2">{book.title}</h2>
          <p className="text-lg text-neutral-600 mb-4">por {book.author}</p>

          {/* Status, gênero, ano e páginas */}
          <div className="flex flex-wrap gap-3 mb-6">
            {book.status && (
              <Badge color={statusMap[book.status].color}>
                {statusMap[book.status].label}
              </Badge>
            )}
            {book.genre && (
              <span className="text-sm text-neutral-500">
                Gênero: {book.genre}
              </span>
            )}
            {book.year && (
              <span className="text-sm text-neutral-500">
                Publicado em: {book.year}
              </span>
            )}
            {book.pages && (
              <span className="text-sm text-neutral-500">
                {book.pages} páginas
              </span>
            )}
          </div>

          {/* Avaliação do livro */}
          <div className="flex items-center gap-1 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={
                  i < (book.rating || 0)
                    ? "text-yellow-400 text-lg"
                    : "text-neutral-300 text-lg"
                }
              >
                ★
              </span>
            ))}
          </div>

          {/* Sinopse do livro */}
          <h3 className="text-xl font-semibold mb-2">Sinopse</h3>
          <p className="text-neutral-700 leading-relaxed mb-8 whitespace-pre-line">
            {book.synopsis || "Sem sinopse disponível."}
          </p>

          {/* Botões de ação */}
          <div className="flex gap-4">
            <Button
              variant="default"
              className="flex items-center gap-2"
              onClick={handleEdit}
            >
              <Pencil size={18} /> Editar
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 size={18} /> Excluir
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
