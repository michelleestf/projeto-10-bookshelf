'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { initialBooks } from '@/lib/books';
import { Book, ReadingStatus } from '@/lib/books';
import { BookCard } from '@/components/ui/BookCard';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function BibliotecaPage() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ReadingStatus | 'all'>('all');
  const [filterGenre, setFilterGenre] = useState<string | 'all'>('all');

  // Buscar livros do backend
  useEffect(() => {
    fetch('/api/books')
      .then(res => res.json())
      .then((data: Book[]) => {
        // Mesclar sem duplicar livros (por id)
        const mergedBooks = [...initialBooks];
        data.forEach(book => {
          if (!mergedBooks.find(b => b.id === book.id)) mergedBooks.push(book);
        });
        setBooks(mergedBooks);
      })
      .catch(err => console.error('Erro ao carregar livros:', err));
  }, []);

  // Função para deletar livro
  const handleDelete = async (id: string) => {
  try {
    const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Erro ao excluir livro');

    setBooks(prev => prev.filter(book => book.id !== id));
    toast.success('Livro excluído com sucesso');
  } catch (err) {
    console.error(err);
    toast.error('Não foi possível excluir o livro');
  }
};


  // Função para editar livro
  const handleEdit = async (updatedBook: Book) => {
    try {
      const res = await fetch(`/api/books/${updatedBook.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedBook),
      });
      if (!res.ok) throw new Error('Erro ao atualizar livro');

      setBooks(prev =>
        prev.map(book => (book.id === updatedBook.id ? updatedBook : book))
      );
      toast.success('Livro atualizado com sucesso');
    } catch (err) {
      console.error(err);
      toast.error('Não foi possível atualizar o livro');
    }
  };


  const genres = Array.from(new Set(books.map(b => b.genre).filter(Boolean)));

  const filteredBooks = books.filter(book => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || book.status === filterStatus;
    const matchesGenre = filterGenre === 'all' || book.genre === filterGenre;

    return matchesSearch && matchesStatus && matchesGenre;
  });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Biblioteca</h1>
          <p className="text-sm text-gray-600">{filteredBooks.length} livros encontrados</p>
        </div>
        {/* <Link href="/adicionar-livros">
          <Button>Adicionar Livro</Button>
        </Link> */}
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
          onValueChange={(value: ReadingStatus | 'all') => setFilterStatus(value)}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onEdit={() => {
              setEditingBook(book);
              setIsModalOpen(true);
            }}
            onDelete={() => handleDelete(book.id)}
            onView={() => console.log("Ver livro", book.id)}
          />
        ))}
      </div>
    </div>
  );
}