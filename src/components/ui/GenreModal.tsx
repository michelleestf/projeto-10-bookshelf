import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Loader2, Plus, Trash2, X } from "lucide-react";
import { toast } from "react-toastify";

interface GenreModalProps {
  open: boolean;
  onClose: () => void;
  onGenresChange?: (genres: string[]) => void;
}

export const GenreModal: React.FC<GenreModalProps> = ({
  open,
  onClose,
  onGenresChange,
}) => {
  const [genres, setGenres] = useState<string[]>([]);
  const [newGenre, setNewGenre] = useState("");
  const [showGenreSuggestions, setShowGenreSuggestions] = useState(false);
  const [addingGenre, setAddingGenre] = useState(false);
  const [deletingGenre, setDeletingGenre] = useState<string | null>(null);
  const [allGenreSuggestions, setAllGenreSuggestions] = useState<string[]>([]);

  useEffect(() => {
    fetchGenres();
    import("@/lib/books").then((mod) => {
      setAllGenreSuggestions(mod.genres);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchGenres() {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      const genreNames = data.map((g: { name: string }) => g.name);
      setGenres(genreNames);
      if (onGenresChange) onGenresChange(genreNames);
    } catch {
      toast.error("Erro ao buscar gêneros.");
    }
  }

  async function handleAddGenre(e: React.FormEvent) {
    e.preventDefault();
    const name = newGenre.trim();
    if (!name) return;
    if (genres.some((g) => g.toLowerCase() === name.toLowerCase())) {
      toast.error("Gênero já existe.");
      return;
    }
    setAddingGenre(true);
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        toast.success("Gênero adicionado!");
        setNewGenre("");
        setShowGenreSuggestions(false);
        await fetchGenres();
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.error || "Erro ao adicionar gênero.");
      }
    } catch {
      toast.error("Erro ao adicionar gênero.");
    } finally {
      setAddingGenre(false);
    }
  }

  async function handleDeleteGenre(name: string) {
    setDeletingGenre(name);
    try {
      const res = await fetch(
        `/api/categories/genres/${encodeURIComponent(name)}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        toast.success("Gênero removido!");
        await fetchGenres();
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.error || "Erro ao remover gênero.");
      }
    } catch {
      toast.error("Erro ao remover gênero.");
    } finally {
      setDeletingGenre(null);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : undefined)}>
      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Gerenciar gêneros globais</DialogTitle>
          <DialogDescription>
            Os gêneros são <b>globais</b> e compartilhados entre todos os
            livros.
            <br />
            <b>Adicionar</b> um novo gênero irá incluí-lo no banco de dados e
            ficará disponível para todos os livros.
            <br />
            <b>Excluir</b> um gênero remove do banco de dados e de todos os
            livros que o utilizam.
          </DialogDescription>
        </DialogHeader>
        <Button
          type="button"
          variant="ghost"
          className="absolute top-2 right-2 p-1 h-7 w-7 text-gray-500 hover:text-black cursor-pointer"
          onClick={onClose}
          aria-label="Fechar modal"
        >
          <X className="w-5 h-5" />
        </Button>
        <form onSubmit={handleAddGenre} className="mt-2 flex flex-col gap-2">
          <div className="flex gap-1 w-full relative">
            <Input
              value={newGenre}
              onChange={(e) => {
                setNewGenre(e.target.value);
                setShowGenreSuggestions(true);
              }}
              placeholder="Novo gênero"
              className="w-full px-2 py-1 text-xs"
              disabled={addingGenre}
              aria-label="Adicionar um novo gênero"
              autoComplete="off"
              onFocus={() => setShowGenreSuggestions(true)}
              onBlur={() =>
                setTimeout(() => setShowGenreSuggestions(false), 120)
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !addingGenre &&
                  newGenre.trim() &&
                  !genres.some(
                    (g) => g.toLowerCase() === newGenre.trim().toLowerCase()
                  )
                ) {
                  handleAddGenre(e);
                  setShowGenreSuggestions(false);
                }
              }}
            />
            <button
              type="submit"
              aria-label="Adicionar gênero"
              disabled={
                addingGenre ||
                !newGenre.trim() ||
                genres.some(
                  (g) => g.toLowerCase() === newGenre.trim().toLowerCase()
                )
              }
              className={`rounded px-2 py-1 text-xs flex items-center transition-colors
                ${
                  addingGenre ||
                  !newGenre.trim() ||
                  genres.some(
                    (g) => g.toLowerCase() === newGenre.trim().toLowerCase()
                  )
                    ? "bg-gray-300 text-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-neutral-800 cursor-pointer"
                }
              `}
            >
              {addingGenre ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Plus className="w-3 h-3" />
              )}
            </button>
            {showGenreSuggestions && newGenre.trim() && (
              <ul className="absolute z-10 left-0 right-0 bg-white border rounded shadow mt-1 max-h-32 overflow-auto text-xs top-full">
                {[...new Set([...allGenreSuggestions, ...genres])]
                  .filter((g) =>
                    g.toLowerCase().includes(newGenre.trim().toLowerCase())
                  )
                  .map((g) => (
                    <li
                      key={g}
                      className="px-2 py-1 cursor-pointer hover:bg-neutral-100"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setNewGenre(g);
                        setShowGenreSuggestions(false);
                      }}
                    >
                      {g}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </form>
        <div className="mt-4">
          <h4 className="font-semibold text-sm mb-2">Gêneros cadastrados</h4>
          <div className="flex flex-wrap gap-2">
            {genres.length > 0 ? (
              genres.map((g) => (
                <span
                  key={g}
                  className="inline-flex items-center bg-neutral-100 rounded px-2 py-1 text-xs"
                >
                  <span title="Gênero global, usado em todos os livros">
                    {g}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remover gênero ${g}`}
                    className="ml-1 text-red-500 hover:text-red-700 cursor-pointer"
                    disabled={deletingGenre === g}
                    onClick={() => handleDeleteGenre(g)}
                  >
                    {deletingGenre === g ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                  </button>
                </span>
              ))
            ) : (
              <span className="text-xs text-neutral-400">
                Nenhum gênero cadastrado.
              </span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
