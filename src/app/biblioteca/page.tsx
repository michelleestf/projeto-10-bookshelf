"use client";

import { useState } from "react";
import Link from "next/link";
import { initialBooks } from "@/lib/books";
import { Book, ReadingStatus } from "@/lib/books";
import { BookCard } from "@/components/ui/BookCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BibliotecaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<ReadingStatus | "">("");
  const [filterGenre, setFilterGenre] = useState<string | "">("");

  const genres = Array.from(
    new Set(initialBooks.map((book) => book.genre).filter(Boolean))
  );

  const filteredBooks = initialBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !filterStatus || book.status === filterStatus;
    const matchesGenre = !filterGenre || book.genre === filterGenre;

    return matchesSearch && matchesStatus && matchesGenre;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Biblioteca</h1>
          <p className="text-neutral-600 text-lg">
            {filteredBooks.length} livros encontrados
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-2">
        <Input
          placeholder="Buscar por título ou autor..."
          className="flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select
          value={filterGenre}
          onValueChange={(value: string) => setFilterGenre(value)}
        >
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Filtrar por gênero" />
          </SelectTrigger>
          <SelectContent>
            {genres
              .filter((g): g is string => !!g)
              .map((genre) => (
                <SelectItem key={genre} value={genre}>
                  {genre}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        <Select
          value={filterStatus}
          onValueChange={(value: ReadingStatus | "") => setFilterStatus(value)}
        >
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

      {(searchTerm || filterGenre || filterStatus) && (
        <div className="flex justify-end mb-8">
          <Button
            variant="outline"
            className="flex items-center gap-1 text-xs px-2 py-1 h-7"
            onClick={() => {
              setSearchTerm("");
              setFilterGenre("");
              setFilterStatus("");
            }}
          >
            Limpar filtros
            <X className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-6">
        {filteredBooks.length === 0 ? (
          <div className="col-span-full text-center text-neutral-500 py-12 text-lg">
            Nenhum livro encontrado com os filtros atuais.
          </div>
        ) : (
          filteredBooks.map((book) => (
            <BookCard key={book.id} book={book} showDetails />
          ))
        )}
      </div>
    </div>
  );
}
