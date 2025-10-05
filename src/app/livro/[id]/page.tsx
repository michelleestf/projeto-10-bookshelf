"use client";

import { use } from "react";
import { useState } from "react";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { initialBooks, Book } from "@/lib/books";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Trash2,
  ArrowLeft,
  BookOpen,
  Calendar,
  Hash,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
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


  const [showDelete, setShowDelete] = useState(false);
  const handleDeleteClick = () => setShowDelete(true);

  const handleEdit = () => {
    router.push(`/livro/${book.id}/editar`);
  };

  // Datas fictícias substituídas por campos reais se existirem
  const addedAt = book.addedAt || "31/01/2024";
  const updatedAt = book.updatedAt || "09/03/2024";
  return (
    <div className="max-w-7xl mx-auto py-10 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/biblioteca"
          className="text-sm text-neutral-700 hover:text-black flex items-center gap-2 font-medium"
        >
          <ArrowLeft size={18} /> Voltar à Biblioteca
        </Link>
      </div>
      <div className="bg-white rounded-2xl border p-6 flex flex-col md:flex-row gap-8">
        {/* Capa do livro */}
        <div className="w-full md:w-[260px] flex flex-col items-center">
          <Image
            src={
              book.cover || "https://covers.openlibrary.org/b/id/10909258-L.jpg"
            }
            alt={book.title}
            width={220}
            height={320}
            className="rounded-lg object-cover border w-[220px] h-[320px]"
          />
          <div className="mt-6 w-full flex flex-col gap-2">
            <Button
              variant="default"
              className="w-full flex items-center gap-2 justify-center text-base font-semibold"
              onClick={handleEdit}
            >
              <Pencil size={18} /> Editar Livro
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 justify-center text-base font-semibold bg-red-600 hover:bg-red-700 text-white border-none"
              onClick={handleDeleteClick}
            >
              <Trash2 size={18} /> Excluir Livro
            </Button>
            <ConfirmDeleteModal
              open={showDelete}
              bookTitle={book.title}
              bookId={book.id}
              onCancel={() => setShowDelete(false)}
            />
          </div>
        </div>
        {/* Informações do livro */}
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1">
            <h2 className="text-3xl font-bold">{book.title}</h2>
            {book.status && (
              <Badge
                color={statusMap[book.status].color}
                className="text-xs px-3 py-1 font-semibold rounded-full whitespace-nowrap"
              >
                {statusMap[book.status].label}
              </Badge>
            )}
          </div>
          <p className="text-neutral-600 text-lg mb-4">por {book.author}</p>

          {/* Avaliação */}
          <div className="flex items-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={
                  i < (book.rating || 0)
                    ? "text-yellow-400 text-xl"
                    : "text-neutral-300 text-xl"
                }
              >
                ★
              </span>
            ))}
            <span className="ml-2 text-neutral-600 text-base font-medium">
              ({book.rating || 0}/5)
            </span>
          </div>

          {/* Grid de informações principais com ícones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-4">
            {book.genre && (
              <div className="flex items-center gap-2 text-neutral-800 text-base">
                <BookOpen size={18} className="text-neutral-400" />
                <span className="font-semibold">Gênero:</span> {book.genre}
              </div>
            )}
            {book.pages !== undefined && book.pages !== null && (
              <div className="flex items-center gap-2 text-neutral-800 text-base">
                <BookOpen size={18} className="text-neutral-400" />
                <span className="font-semibold">Páginas:</span> {book.pages}
              </div>
            )}
            {book.year !== undefined && book.year !== null && (
              <div className="flex items-center gap-2 text-neutral-800 text-base">
                <Calendar size={18} className="text-neutral-400" />
                <span className="font-semibold">Ano:</span> {book.year}
              </div>
            )}
            {book.isbn && (
              <div className="flex items-center gap-2 text-neutral-800 text-base">
                <Hash size={18} className="text-neutral-400" />
                <span className="font-semibold">ISBN:</span> {book.isbn}
              </div>
            )}
          </div>

          {/* Barra de progresso de leitura */}
          {book.status === "LENDO" && book.pages && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-neutral-700">
                  Progresso de leitura:
                </span>
                <span className="text-xs text-neutral-500">
                  {book.currentPage || 0} / {book.pages} páginas
                </span>
              </div>
              <Progress
                value={Math.min(
                  100,
                  Math.round(((book.currentPage || 0) / book.pages) * 100)
                )}
                className="h-2"
              />
            </div>
          )}

          <hr className="my-4" />

          {/* Sinopse */}
          {book.synopsis && (
            <>
              <h3 className="text-lg font-semibold mb-1">Sinopse</h3>
              <p className="text-neutral-700 leading-relaxed mb-6 whitespace-pre-line">
                {book.synopsis}
              </p>
            </>
          )}

          {/* Notas Pessoais */}
          {book.notes && (
            <>
              <hr className="my-4" />
              <h3 className="text-lg font-semibold mb-1">Notas Pessoais</h3>
              <p className="text-neutral-700 leading-relaxed mb-6 whitespace-pre-line">
                {book.notes}
              </p>
            </>
          )}

          <hr className="my-4" />
          <div className="flex flex-wrap justify-between text-xs text-neutral-500">
            {book.addedAt && <span>Adicionado em: {book.addedAt}</span>}
            {book.updatedAt && (
              <span>Última atualização: {book.updatedAt}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
