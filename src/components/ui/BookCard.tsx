import { cn } from "@/lib/utils";
import { Book } from "@/lib/books";
import Image from "next/image";
import { Badge } from "./Badge";
import { Eye, Pencil, Trash2 } from "lucide-react";

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
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border shadow-sm relative">
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={onView}
          aria-label="Ver livro"
          className="text-neutral-500 hover:text-black"
        >
          <Eye size={18} />
        </button>
        <button
          onClick={onEdit}
          aria-label="Editar livro"
          className="text-neutral-500 hover:text-black"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={onDelete}
          aria-label="Excluir livro"
          className="text-neutral-500 hover:text-red-600"
        >
          <Trash2 size={18} />
        </button>
      </div>
      <div className="w-[56px] h-[80px] flex items-center justify-center">
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
      <div className="flex-1">
        <div className="font-semibold text-base mb-1">{book.title}</div>
        <div className="text-sm text-neutral-500 mb-1">{book.author}</div>
        <div className="flex items-center gap-2">
          {book.status && (
            <Badge color={statusMap[book.status].color as any}>
              {statusMap[book.status].label}
            </Badge>
          )}
          <div className="flex gap-1 ml-1">
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
