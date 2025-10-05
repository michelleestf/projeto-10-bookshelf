"use client";

import { useState, useEffect } from "react";
import { Star, Eye, Save, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/Card";
import type { ReadingStatus, Genre, Book } from "@/lib/books";
import { genres } from "@/lib/books";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdicionarLivros() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState<Genre | "">("");
  const [year, setYear] = useState("");
  const [isbn, setIsbn] = useState("");
  const [status, setStatus] = useState<ReadingStatus | "">("");
  const [pages, setPages] = useState("");
  const [currentPage, setCurrentPage] = useState("");
  const [rating, setRating] = useState(0);
  const [synopsis, setSynopsis] = useState("");
  const [notes, setNotes] = useState("");
  const [cover, setCover] = useState("");
  const [coverValid, setCoverValid] = useState(false);

  const isValid = Boolean(title.trim() && author.trim() && genre && status);

  function handleAddBook(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }
    try {
      const newBook = {
        id: Date.now().toString(),
        title: title.trim(),
        author: author.trim(),
        genre,
        year: year ? Number(year) : undefined,
        isbn: isbn || undefined,
        status,
        pages: pages ? Number(pages) : undefined,
        currentPage: currentPage ? Number(currentPage) : undefined,
        rating: rating || undefined,
        synopsis: synopsis || undefined,
        notes: notes || undefined,
        cover: cover || undefined,
      };
      const books = JSON.parse(localStorage.getItem("bookshelf-books") || "[]");
      books.push(newBook);
      localStorage.setItem("bookshelf-books", JSON.stringify(books));
      toast.success("Livro adicionado com sucesso!");

      setTitle("");
      setAuthor("");
      setGenre("");
      setYear("");
      setIsbn("");
      setStatus("");
      setPages("");
      setCurrentPage("");
      setRating(0);
      setSynopsis("");
      setNotes("");
      setCover("");
      setCoverValid(false);
    } catch (err) {
      toast.error("Erro ao adicionar livro!");
    }
  }

  const StarRating = ({
    value,
    onChange,
  }: {
    value: number;
    onChange: (v: number) => void;
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= value;
        return (
          <button
            type="button"
            key={star}
            aria-label={`Avaliar com ${star} estrela${star > 1 ? "s" : ""}`}
            onClick={() => onChange(star === value ? 0 : star)}
            className="focus:outline-none cursor-pointer"
          >
            <Star
              size={28}
              stroke={isFilled ? "#facc15" : "#a3a3a3"}
              strokeWidth={isFilled ? 2 : 1}
              fill={isFilled ? "#facc15" : "none"}
              className="transition-colors"
            />
          </button>
        );
      })}
    </div>
  );

  const campos = [
    title,
    author,
    genre,
    year,
    isbn,
    status,
    pages,
    currentPage,
    rating,
    synopsis,
    notes,
    cover,
  ];
  const totalCampos = campos.length;
  const preenchidos = campos.filter((c) => {
    if (typeof c === "string") return c.trim() !== "";
    if (typeof c === "number") return c !== 0;
    return !!c;
  }).length;
  const progresso = Math.round((preenchidos / totalCampos) * 100);

  useEffect(() => {
    if (cover && cover.match(/^https?:\/\//i)) {
      setCoverValid(true);
    } else {
      setCoverValid(false);
    }
  }, [cover]);

  const statusOptions: { value: ReadingStatus; label: string; desc: string }[] =
    [
      {
        value: "QUERO_LER",
        label: "Quero Ler",
        desc: "Livro na lista de desejos",
      },
      { value: "LENDO", label: "Lendo", desc: "Livro em progresso" },
      { value: "LIDO", label: "Lido", desc: "Livro finalizado" },
      {
        value: "PAUSADO",
        label: "Pausado",
        desc: "Leitura temporariamente interrompida",
      },
      { value: "ABANDONADO", label: "Abandonado", desc: "Leitura abandonada" },
    ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Adicionar Novo Livro</h1>
          <p className="text-neutral-600 text-lg">
            Preencha as informações do livro que deseja adicionar à sua
            biblioteca.
          </p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => window.history.back()}
        >
          <ArrowLeft size={16} /> Voltar
        </Button>
      </div>
      {/* Progresso do Preenchimento */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
          Progresso do Preenchimento
        </h2>
        <p className="text-xs text-gray-500 mb-2">
          Os campos marcados com <span className="text-red-500">*</span> são
          obrigatórios.
        </p>
        <div className="flex items-center gap-4">
          <Progress value={progresso} className="h-2.5 w-full" />
          <span className="text-sm font-medium text-gray-700">
            {progresso}%
          </span>
        </div>
        <span className="text-sm text-gray-500">Campos preenchidos</span>
      </Card>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Informações Básicas */}
          <Card>
            <h3 className="text-md font-semibold mb-4">Informações Básicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Título <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Digite o título do livro"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Autor <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Digite o nome do autor"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Gênero <span className="text-red-500">*</span>
                </label>
                <Select
                  value={genre}
                  onValueChange={(v) => setGenre(v as Genre)}
                >
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Ano de Publicação
                </label>
                <Input
                  placeholder="2024"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">ISBN</label>
                <Input
                  placeholder="978-85-123-4567-8"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                />
              </div>
            </div>
          </Card>

          {/* Informações de Leitura */}
          <Card>
            <h3 className="text-md font-semibold mb-4">
              Informações de Leitura
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Status de Leitura <span className="text-red-500">*</span>
                </label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as ReadingStatus)}
                >
                  <SelectTrigger className="w-full cursor-pointer">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {status && (
                  <p className="text-xs text-gray-500 mt-1">
                    {statusOptions.find((opt) => opt.value === status)?.desc}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Total de Páginas
                </label>
                <Input
                  placeholder="0"
                  type="number"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Página Atual
                </label>
                <Input
                  placeholder="0"
                  type="number"
                  value={currentPage}
                  onChange={(e) => setCurrentPage(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Avaliação (1-5 estrelas)
                </label>
                <StarRating value={rating} onChange={setRating} />
                {rating === 0 && (
                  <span className="text-xs text-gray-400">Sem avaliação</span>
                )}
              </div>
            </div>
          </Card>

          {/* Informações Adicionais */}
          <Card>
            <h3 className="text-md font-semibold mb-4">
              Informações Adicionais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">Sinopse</label>
                <Textarea
                  rows={3}
                  placeholder="Descrição breve do enredo do livro..."
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  className="resize-none overflow-auto h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Notas Pessoais
                </label>
                <Textarea
                  rows={3}
                  placeholder="Suas impressões, comentários ou lembretes sobre o livro..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="resize-none overflow-auto h-24"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Coluna lateral */}
        <div className="flex flex-col gap-6">
          {/* Capa do Livro */}
          <Card className="flex flex-col gap-4">
            <h3 className="text-md font-semibold mb-4">Capa do Livro</h3>
            <div>
              <label className="block text-sm font-medium">URL da Capa</label>
              <Input
                placeholder="https://exemplo.com/capa.jpg"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Preview da Capa
              </label>
              <div className="w-full">
                {coverValid ? (
                  <img
                    src={cover}
                    alt="Preview da Capa"
                    className="w-full object-cover rounded"
                  />
                ) : (
                  <span className="text-gray-400 flex flex-col items-center h-48 w-full justify-center">
                    <Eye className="h-8 w-8 mb-1" />
                    Preview da capa aparecerá aqui
                  </span>
                )}
              </div>
            </div>
          </Card>
          {/* Botões */}
          <div className="flex flex-col gap-2">
            <Button
              className="w-full flex items-center justify-center gap-2 cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
              disabled={!isValid}
              onClick={handleAddBook}
              type="button"
            >
              <Save className="h-5 w-5" />
              Adicionar Livro
            </Button>
            <Button variant="outline" className="w-full cursor-pointer">
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
