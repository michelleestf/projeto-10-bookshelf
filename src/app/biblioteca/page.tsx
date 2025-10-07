"use client";
import { useEffect, useState, useMemo } from "react";
import { Book, ReadingStatus } from "@/lib/books";
import { BookCard } from "@/components/ui/BookCard";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/Input";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import BookCardSkeleton from "@/components/ui/BookCardSkeleton";

function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function BibliotecaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [genre, setGenre] = useState(searchParams.get("genre") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [loading, setLoading] = useState(true);
  const [genres, setGenres] = useState<string[]>([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (genre) params.set("genre", genre);
    if (status) params.set("status", status);
    router.replace(`/biblioteca?${params.toString()}`);
  }, [search, genre, status, router]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setGenres(data.map((g: { name: string }) => g.name)));
  }, []);

  const fetchBooks = useMemo(
    () =>
      debounce((...args: unknown[]) => {
        const [searchValue, genreValue, statusValue] = args as [
          string,
          string,
          string
        ];
        (async () => {
          setLoading(true);
          try {
            const params = new URLSearchParams();
            if (searchValue) params.set("search", searchValue);
            if (genreValue) params.set("genre", genreValue);
            if (statusValue) params.set("status", statusValue);
            const res = await fetch(`/api/books?${params.toString()}`);
            if (!res.ok) throw new Error("Erro ao buscar livros");
            const data = await res.json();
            setBooks(data);
            toast.success("Biblioteca carregada com sucesso");
          } catch (err) {
            setBooks([]);
            toast.error("Erro ao buscar livros, tente novamente mais tarde.");
          } finally {
            setLoading(false);
          }
        })();
      }, 400),
    []
  );

  useEffect(() => {
    setLoading(true);
    fetchBooks(search, genre, status);
  }, [search, genre, status, fetchBooks]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Biblioteca</h1>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-2">
        <Input
          placeholder="Buscar por título ou autor..."
          className="flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por gênero" />
          </SelectTrigger>
          <SelectContent>
            {genres.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LIDO">Lido</SelectItem>
            <SelectItem value="LENDO">Lendo</SelectItem>
            <SelectItem value="QUERO_LER">Quero Ler</SelectItem>
            <SelectItem value="PAUSADO">Pausado</SelectItem>
            <SelectItem value="ABANDONADO">Abandonado</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {(search || genre || status) && (
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            className="flex items-center gap-1 text-xs px-2 py-1 h-7"
            onClick={() => {
              setSearch("");
              setGenre("");
              setStatus("");
            }}
          >
            Limpar filtros
            <X className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => <BookCardSkeleton key={i} />)
        ) : books.length === 0 ? (
          <div className="col-span-full text-center text-neutral-500 py-12 text-lg">
            Nenhum livro encontrado com os filtros atuais.
          </div>
        ) : (
          books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              showDetails
              showDeleteButton
              onDeleted={() => fetchBooks(search, genre, status)}
            />
          ))
        )}
      </div>
    </div>
  );
}
