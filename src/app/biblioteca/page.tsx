"use client";

import { useState } from "react";
import Link from "next/link";
import { initialBooks } from "@/lib/books";
import { Book, ReadingStatus } from "@/lib/books";
import { BookCard } from "@/components/ui/BookCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function BibliotecaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<ReadingStatus | "all">(
    "all"
  );

  const filteredBooks = initialBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || book.status === filterStatus;

    return matchesSearch && matchesStatus;
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

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
        <Input
          placeholder="Buscar por título ou autor..."
          className="flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por gênero" />
          </SelectTrigger>
          <SelectContent>
            {/* Adicione os itens de gênero aqui */}
          </SelectContent>
        </Select>

        <Select
          onValueChange={(value: ReadingStatus | "all") =>
            setFilterStatus(value)
          }
          defaultValue="all"
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="LIDO">Lido</SelectItem>
            <SelectItem value="LENDO">Lendo</SelectItem>
            <SelectItem value="QUERO_LER">Quero Ler</SelectItem>
            <SelectItem value="PAUSADO">Pausado</SelectItem>
            <SelectItem value="ABANDONADO">Abandonado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} showDetails />
        ))}
      </div>
    </div>
  );
}
