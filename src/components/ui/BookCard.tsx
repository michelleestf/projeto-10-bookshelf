"use client";

import { cn } from "@/lib/utils";
import { Book } from "@/lib/books";
import Image from "next/image";
import { Badge } from "./Badge";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

interface BookCardProps {
  book: Book;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showDetails?: boolean; // mostra gênero, ano, progresso
}

const statusMap = {
  QUERO_LER: { label: "Quero Ler", color: "info" },
  LENDO: { label: "Lendo", color: "success" },
  LIDO: { label: "Lido", color: "muted" },
  PAUSADO: { label: "Pausado", color: "warning" },
  ABANDONADO: { label: "Abandonado", color: "danger" },
};

export function BookCard({
  book,
  onView,
  onEdit,
  onDelete,
  showDetails,
}: BookCardProps) {
  // progresso só se status for LENDO e tiver pages e currentPage
  const progresso =
    book.status === "LENDO" && book.pages && book.currentPage
      ? Math.round((book.currentPage / book.pages) * 100)
      : null;
  return (
    <div className="p-4 bg-white rounded-xl border flex items-center gap-6 min-h-[100px]">
      {/* Capa do livro */}
      <div className="w-[56px] h-[80px] flex items-center justify-center flex-shrink-0">
        <Image
          src={
            book.cover || "https://covers.openlibrary.org/b/id/10909258-L.jpg"
          }
          alt={book.title}
          width={56}
          height={80}
          className="rounded-md object-cover border w-[56px] h-[80px]"
        />
      </div>
      {/* Informações do livro */}
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-base leading-snug line-clamp-2 mb-0.5">
          {book.title}
        </div>
        <div className="text-sm text-neutral-500 mb-2">{book.author}</div>
        <div className="flex items-center gap-2 flex-wrap">
          {book.status && (
            <Badge
              color={
                statusMap[book.status].color as
                  | "info"
                  | "success"
                  | "muted"
                  | "warning"
                  | "danger"
              }
            >
              {statusMap[book.status].label}
            </Badge>
          )}
          {showDetails && book.genre && (
            <Badge color="muted">{book.genre}</Badge>
          )}
          {showDetails && book.year && (
            <span className="text-neutral-500 text-sm ml-1">{book.year}</span>
          )}
        </div>
        <div className="flex gap-1 mt-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span
              key={i}
              className={cn(
                i < (book.rating || 0) ? "text-yellow-400" : "text-neutral-300",
                "text-base"
              )}
            >
              ★
            </span>
          ))}
        </div>
        {showDetails && progresso !== null && (
          <>
            <div className="text-xs text-neutral-500 mt-2 flex justify-between">
              <span>Progresso</span>
              <span>
                {book.currentPage}/{book.pages} ({progresso}%)
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden mt-1">
              <div
                className="h-2 bg-black rounded-full"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </>
        )}
      </div>
      {/* Ações */}
      <div className="flex flex-col gap-2 ml-4 shrink-0 items-end justify-center">
        <button
          onClick={onView}
          aria-label="Ver livro"
          className="text-neutral-500 hover:text-black"
        >
          <Link
            href={`/livro/${book.id}`}
            title="Visualizar detalhes do livro"
            onClick={(e) => {
              if (onView) {
                e.preventDefault();
                onView();
              }
            }}
          >
            <Eye size={20} />
          </Link>
        </button>
        <button
          onClick={onEdit}
          aria-label="Editar livro"
          className="text-neutral-500 hover:text-black"
        >
          <Pencil size={20} />
        </button>
        {onDelete && (
          <button
            onClick={onDelete}
            aria-label="Excluir livro"
            className="text-neutral-500 hover:text-red-600"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
