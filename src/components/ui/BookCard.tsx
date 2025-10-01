'use client';

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
}

const statusMap = {
  QUERO_LER: { label: "Quero Ler", color: "info" },
  LENDO: { label: "Lendo", color: "success" },
  LIDO: { label: "Lido", color: "muted" },
  PAUSADO: { label: "Pausado", color: "warning" },
  ABANDONADO: { label: "Abandonado", color: "danger" },
};

export function BookCard({ book, onView, onEdit, onDelete }: BookCardProps) {
  return (
    <div className="p-4 bg-white rounded-xl border shadow-sm flex flex-col relative">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="font-semibold text-base leading-snug line-clamp-2">
            {book.title}
          </div>
          <div className="text-sm text-neutral-500">{book.author}</div>
        </div>
        <div className="flex gap-2 ml-2 shrink-0">
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
              <Eye size={18} />
            </Link>

          </button>

          <button
            onClick={() => onEdit && onEdit()}
            aria-label="Editar livro"
            className="text-neutral-500 hover:text-black"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => onDelete && onDelete()}
            aria-label="Excluir livro"
            className="text-neutral-500 hover:text-red-600"
          >
            <Trash2 size={18} />
          </button>

        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="w-[56px] h-[80px] flex items-center justify-center">
          <Image
            src={
              book.cover ||
              "https://covers.openlibrary.org/b/id/10909258-L.jpg"
            }
            alt={book.title}
            width={56}
            height={80}
            className="rounded-md object-cover border w-[56px] h-[80px]"
          />
        </div>
        <div className="flex-1">
          {book.status && (
            <Badge color={statusMap[book.status].color as any}>
              {statusMap[book.status].label}
            </Badge>
          )}
          <div className="flex gap-1 mt-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  i < (book.rating || 0)
                    ? "text-yellow-400"
                    : "text-neutral-300",
                  "text-base"
                )}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}