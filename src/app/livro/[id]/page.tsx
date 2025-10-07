"use client";

import { use, useEffect, useState } from "react";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import type { Book } from "@/lib/books";
import { formatDateToBR } from "@/lib/utils";
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
import BookDetailsSkeleton from "@/components/ui/BookDetailsSkeleton";

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

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchBook() {
      setLoading(true);
      try {
        const res = await fetch(`/api/books/${id}`);
        if (!res.ok) {
          setBook(null);
        } else {
          const data = await res.json();
          setBook(data);
        }
      } catch {
        setBook(null);
      }
      setLoading(false);
    }
    if (id) fetchBook();
  }, [id]);

  const handleDeleteClick = () => setShowDelete(true);
  const handleEdit = () => {
    if (book) router.push(`/livro/${book.id}/editar`);
  };

  if (loading) {
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
        <BookDetailsSkeleton />
      </div>
    );
  }
  if (!book) {
    return (
      <NotFound message="O livro que você está tentando acessar não existe ou foi removido." />
    );
  }
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
      <div className="rounded-2xl border border-border bg-card text-card-foreground p-6 flex flex-col md:flex-row gap-8">
        {/* Capa do livro */}
        <div className="w-full md:w-[260px] flex flex-col items-center">
          <Image
            src={
              book.cover || "https://covers.openlibrary.org/b/id/10909258-L.jpg"
            }
            alt={book.title}
            width={260}
            height={390}
            className="rounded-lg object-cover border border-border w-[260px]"
          />
        </div>
        {/* Informações do livro */}
        <div className="flex-1 flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-1">
            <h2 className="text-3xl font-bold text-card-foreground">
              {book.title}
            </h2>
            {book.status && (
              <Badge
                color={statusMap[book.status].color}
                className="text-xs px-3 py-1 font-semibold rounded-full whitespace-nowrap w-fit"
              >
                {statusMap[book.status].label}
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground text-lg mb-4">
            por {book.author}
          </p>

          {/* Avaliação */}
          {typeof book.rating === "number" && book.rating > 0 && (
            <div className="flex items-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < (book.rating ?? 0)
                      ? "text-yellow-400 text-xl"
                      : "text-neutral-300 text-xl"
                  }
                >
                  ★
                </span>
              ))}
              <span className="ml-2 text-muted-foreground text-base font-medium">
                ({book.rating}/5)
              </span>
            </div>
          )}

          {/* Grid de informações principais com ícones */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 mb-4 text-card-foreground">
            {book.genre && (
              <div className="flex items-center gap-2 text-card-foreground text-base">
                <BookOpen size={18} className="text-muted-foreground" />
                <span className="font-semibold">Gênero:</span>{" "}
                {typeof book.genre === "string" ? book.genre : book.genre?.name}
              </div>
            )}
            {book.pages !== undefined && book.pages !== null && (
              <div className="flex items-center gap-2 text-card-foreground text-base">
                <BookOpen size={18} className="text-muted-foreground" />
                <span className="font-semibold">Páginas:</span> {book.pages}
              </div>
            )}
            {book.year !== undefined && book.year !== null && (
              <div className="flex items-center gap-2 text-card-foreground text-base">
                <Calendar size={18} className="text-muted-foreground" />
                <span className="font-semibold">Ano:</span> {book.year}
              </div>
            )}
            {book.isbn && (
              <div className="flex items-center gap-2 text-card-foreground text-base">
                <Hash size={18} className="text-muted-foreground" />
                <span className="font-semibold">ISBN:</span> {book.isbn}
              </div>
            )}
          </div>

          {/* Barra de progresso de leitura */}
          {book.status === "LENDO" && book.pages && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-accent-foreground">
                  Progresso de leitura:
                </span>
                <span className="text-xs text-accent-foreground">
                  {book.currentPage || 0} / {book.pages} páginas
                </span>
                <span className="text-xs text-accent-foreground ">
                  (
                  {(() => {
                    const total = book.pages || 0;
                    const atual = book.currentPage || 0;
                    if (!total) return "0%";
                    return `${Math.round((atual / total) * 100)}%`;
                  })()}
                  )
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

          {/* Sinopse */}
          {book.synopsis && (
            <>
              <hr className="my-4" />
              <h3 className="text-lg font-semibold mb-1 text-card-foreground">
                Sinopse
              </h3>
              <p className="text-card-foreground leading-relaxed whitespace-pre-line">
                {book.synopsis}
              </p>
            </>
          )}

          {/* Notas Pessoais */}
          {book.notes && (
            <>
              <hr className="my-4" />
              <h3 className="text-lg font-semibold mb-1 text-card-foreground">
                Notas Pessoais
              </h3>
              <p className="text-card-foreground leading-relaxed whitespace-pre-line">
                {book.notes}
              </p>
            </>
          )}

          <hr className="my-4" />
          <div className="flex flex-wrap justify-between text-xs text-muted-foreground">
            {book.createdAt && (
              <span>Adicionado em: {formatDateToBR(book.createdAt)}</span>
            )}
            {book.updatedAt && (
              <span>Última atualização: {formatDateToBR(book.updatedAt)}</span>
            )}
          </div>
          <div className="mt-6 w-full grid grid-cols-1 gap-2 sm:grid-cols-2">
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 justify-center cursor-pointer"
              onClick={handleEdit}
            >
              <Pencil size={18} /> Editar Livro
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center gap-2 justify-center cursor-pointer hover:border-red-500 hover:text-red-600"
              onClick={handleDeleteClick}
            >
              <Trash2 size={18} /> Excluir Livro
            </Button>
            <ConfirmDeleteModal
              open={showDelete}
              bookTitle={book.title}
              bookId={book.id}
              onCancel={() => setShowDelete(false)}
              onDeleted={() => {
                router.push("/biblioteca");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
