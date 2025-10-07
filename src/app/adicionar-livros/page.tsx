"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, Save, ArrowLeft, Loader2, Pencil, Eye } from "lucide-react";
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
import type { ReadingStatus } from "@/lib/books";
import { GenreModal } from "@/components/ui/GenreModal";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdicionarLivros() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState<string>("");
  const [genres, setGenres] = useState<string[]>([]);
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
  const [loading, setLoading] = useState(false);
  const [showGenreModal, setShowGenreModal] = useState(false);

  const isValid = Boolean(title.trim() && author.trim() && genre && status);
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setGenres(data.map((g: { name: string }) => g.name)));
  }, []);

  useEffect(() => {
    if (cover && cover.match(/^https?:\/\//i)) {
      setCoverValid(true);
    } else {
      setCoverValid(false);
    }
  }, [cover]);

  useEffect(() => {
    const totalPagesValue = pages ? Number(pages) : undefined;
    if (status === "LIDO") {
      if (totalPagesValue) {
        setCurrentPage(String(totalPagesValue));
      } else {
        setCurrentPage("");
      }
    }
  }, [status]);

  useEffect(() => {
    const totalPagesValue = pages ? Number(pages) : undefined;
    if (status === "LIDO" && totalPagesValue) {
      setCurrentPage(String(totalPagesValue));
    }
  }, [pages]);

  async function handleAddBook(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }
    setLoading(true);
    try {
      const newBook: {
        title?: string;
        author?: string;
        genre?: string;
        year?: number;
        isbn?: string;
        status?: ReadingStatus;
        pages?: number;
        currentPage?: number;
        rating?: number;
        synopsis?: string;
        notes?: string;
        cover?: string;
      } = {};
      if (title.trim()) newBook.title = title.trim();
      if (author.trim()) newBook.author = author.trim();
      if (genre) newBook.genre = genre;
      if (year) newBook.year = Number(year);
      if (isbn) newBook.isbn = isbn;
      if (status) newBook.status = status;
      if (pages) newBook.pages = Number(pages);
      if (currentPage) newBook.currentPage = Number(currentPage);
      if (rating) newBook.rating = rating;
      if (synopsis) newBook.synopsis = synopsis;
      if (notes) newBook.notes = notes;
      if (cover) newBook.cover = cover;
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBook),
      });
      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData.error || "Erro ao adicionar livro!");
        setLoading(false);
        return;
      }
      const createdBook = await response.json();
      toast.success("Livro adicionado com sucesso!");
      router.push(`/livro/${createdBook.id}`);
    } catch {
      toast.error("Erro ao adicionar livro!");
      setLoading(false);
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
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="order-2 sm:order-1">
            <h1 className="text-3xl font-bold mb-2 text-foreground">
              Adicionar Novo Livro
            </h1>
            <p className="text-neutral-600 text-lg">
              Preencha as informações do livro que deseja adicionar à sua
              biblioteca.
            </p>
          </div>
          <div className="order-1 sm:order-2 flex justify-end">
            <Button
              variant="outline"
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => window.history.back()}
            >
              <ArrowLeft size={16} /> Voltar
            </Button>
          </div>
        </div>
      </div>
      {/* Progresso do Preenchimento */}
      <Card className="mb-6">
        <h2 className="text-lg font-semibold mb-2 text-card-foreground">
          Progresso do Preenchimento
        </h2>
        <p className="text-xs text-muted-foreground mb-2">
          Os campos marcados com <span className="text-destructive">*</span> são
          obrigatórios.
        </p>
        <div className="flex items-center gap-4">
          <Progress value={progresso} className="h-2.5 w-full" />
          <span className="text-sm font-medium text-accent-foreground">
            {progresso}%
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          Campos preenchidos
        </span>
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
                <label className="block text-sm font-medium text-card-foreground">
                  Título <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="Digite o título do livro"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                text
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground">
                  Autor <span className="text-destructive">*</span>
                </label>
                <Input
                  placeholder="Digite o nome do autor"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground">
                  Ano de Publicação
                </label>
                <Input
                  placeholder="Digite o ano de publicação (ex: 2024)"
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground">
                  ISBN
                </label>
                <Input
                  placeholder="Ex: 978-85-123-4567-8"
                  value={isbn}
                  onChange={(e) => setIsbn(e.target.value)}
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium">
                Gênero <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2 items-center">
                <div className="flex-1">
                  <Select value={genre} onValueChange={setGenre}>
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
                <Button
                  variant="outline"
                  type="button"
                  aria-label="Editar gêneros disponíveis"
                  className="cursor-pointer"
                  onClick={() => setShowGenreModal(true)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
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
                <label className="block text-sm font-medium text-card-foreground">
                  Status de Leitura <span className="text-destructive">*</span>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    {statusOptions.find((opt) => opt.value === status)?.desc}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground">
                  Total de Páginas
                </label>
                <Input
                  placeholder="Total de páginas do livro"
                  type="number"
                  value={pages}
                  onChange={(e) => setPages(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground">
                  Página Atual
                </label>
                <Input
                  placeholder="Página atual da leitura"
                  type="number"
                  value={currentPage}
                  onChange={(e) => {
                    const value = e.target.value;
                    const totalPagesValue = pages ? Number(pages) : undefined;
                    if (
                      totalPagesValue !== undefined &&
                      value !== "" &&
                      Number(value) > totalPagesValue
                    ) {
                      toast.error(
                        "A página atual não pode ser maior que o total de páginas!"
                      );
                      return;
                    }
                    setCurrentPage(value);
                  }}
                  disabled={status === "LIDO" && !!pages}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-card-foreground">
                  Avaliação (1-5 estrelas)
                </label>
                <StarRating value={rating} onChange={setRating} />
                {rating === 0 && (
                  <span className="text-xs text-gray-400">Sem avaliação</span>
                )}
              </div>
            </div>
          </Card>
          {/* Modal de edição de gêneros */}
          {showGenreModal && (
            <GenreModal
              open={showGenreModal}
              onClose={() => setShowGenreModal(false)}
              onGenresChange={setGenres}
            />
          )}

          {/* Informações Adicionais */}
          <Card>
            <h3 className="text-md font-semibold mb-4">
              Informações Adicionais
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-card-foreground">
                  Sinopse
                </label>
                <Textarea
                  rows={3}
                  placeholder="Descrição breve do enredo do livro..."
                  value={synopsis}
                  onChange={(e) => setSynopsis(e.target.value)}
                  className="resize-none overflow-auto h-24"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-card-foreground">
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
              <label className="block text-sm font-medium text-card-foreground">
                URL da Capa
              </label>
              <Input
                placeholder="https://exemplo.com/capa.jpg"
                value={cover}
                onChange={(e) => setCover(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-card-foreground">
                Preview da Capa
              </label>
              <div className="w-full">
                {coverValid ? (
                  <Image
                    src={cover}
                    alt="Preview da Capa"
                    width={400}
                    height={600}
                    className="w-full object-cover rounded"
                  />
                ) : (
                  <span className="text-muted-foreground flex flex-col items-center h-48 w-full justify-center">
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
              disabled={!isValid || loading}
              onClick={handleAddBook}
              type="button"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Adicionando...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  Adicionar Livro
                </>
              )}
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
