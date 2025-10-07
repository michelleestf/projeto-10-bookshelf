"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
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
import { toast } from "react-toastify";
import { ArrowLeft, Save, Star, Loader2, Pencil } from "lucide-react";
import { GenreModal } from "@/components/ui/GenreModal";
import NotFound from "@/components/ui/NotFound";
import { EditarLivroSkeleton } from "@/components/ui/EditarLivroSkeleton";
import "react-toastify/dist/ReactToastify.css";

export default function EditarLivroPage() {
  const [showGenreModal, setShowGenreModal] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [book, setBook] = useState<Book | null>(null);

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

  const initialBookRef = useRef<Book | null>(null);
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/books/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("not found");
        const found = await res.json();
        setBook(found);
        setTitle(found.title || "");
        setAuthor(found.author || "");
        setGenre(
          typeof found.genre === "string"
            ? found.genre
            : found.genre?.name || ""
        );
        setYear(found.year ? String(found.year) : "");
        setIsbn(found.isbn || "");
        setStatus(found.status || "");
        setPages(found.pages ? String(found.pages) : "");
        setCurrentPage(found.currentPage ? String(found.currentPage) : "");
        setRating(found.rating || 0);
        setSynopsis(found.synopsis || "");
        setNotes(found.notes || "");
        setCover(found.cover || "");
        initialBookRef.current = found;
      })
      .catch(() => {
        setBook(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

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

  const isValid = Boolean(title.trim() && author.trim() && genre && status);

  const isChanged = (() => {
    const initial = initialBookRef.current;
    if (!initial) return false;
    return (
      title !== (initial.title || "") ||
      author !== (initial.author || "") ||
      genre !== (initial.genre || "") ||
      year !== (initial.year ? String(initial.year) : "") ||
      isbn !== (initial.isbn || "") ||
      status !== (initial.status || "") ||
      pages !== (initial.pages ? String(initial.pages) : "") ||
      currentPage !==
        (initial.currentPage ? String(initial.currentPage) : "") ||
      rating !== (initial.rating || 0) ||
      synopsis !== (initial.synopsis || "") ||
      notes !== (initial.notes || "") ||
      cover !== (initial.cover || "")
    );
  })();

  async function handleUpdateBook(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }
    setUpdating(true);
    try {
      let currentPageValue = currentPage ? Number(currentPage) : undefined;
      const totalPagesValue = pages ? Number(pages) : undefined;
      if (status === "LIDO" && totalPagesValue) {
        currentPageValue = totalPagesValue;
      }
      const updatedBook = {
        title: title.trim(),
        author: author.trim(),
        genre,
        year: year ? Number(year) : undefined,
        isbn: isbn || undefined,
        status: status || undefined,
        pages: totalPagesValue,
        currentPage: currentPageValue,
        rating: rating || undefined,
        synopsis: synopsis || undefined,
        notes: notes || undefined,
        cover: cover || undefined,
      };
      const res = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedBook),
      });
      if (res.ok) {
        const data = await res.json();
        toast.success("Livro atualizado com sucesso!");
        setBook(data);
        router.push(`/livro/${id}`);
      } else if (res.status === 404) {
        toast.error("Livro não encontrado para edição!");
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.error || "Erro ao atualizar livro!");
      }
    } catch {
      toast.error("Erro ao atualizar livro!");
    } finally {
      setUpdating(false);
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

  if (!loading && !book) {
    return (
      <NotFound message="O livro que você está tentando acessar não existe ou foi removido." />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div className="order-2 sm:order-1">
            <h1 className="text-4xl font-bold mb-2">Editar Livro</h1>
            <p className="text-neutral-600 text-lg">
              Altere as informações do livro e salve as mudanças.
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
      {loading ? (
        <EditarLivroSkeleton />
      ) : (
        <>
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
              <Progress
                value={(() => {
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
                  return Math.round((preenchidos / totalCampos) * 100);
                })()}
                className="h-2.5 w-full"
              />
              <span className="text-sm font-medium text-gray-700">
                {(() => {
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
                  return Math.round((preenchidos / totalCampos) * 100);
                })()}
                %
              </span>
            </div>
            <span className="text-sm text-gray-500">Campos preenchidos</span>
          </Card>
          <form onSubmit={handleUpdateBook}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Coluna principal */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Informações Básicas */}
                <Card>
                  <h3 className="text-md font-semibold mb-4">
                    Informações Básicas
                  </h3>
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
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium">
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
                      <label className="block text-sm font-medium">ISBN</label>
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
                      <button
                        type="button"
                        aria-label="Editar gêneros disponíveis"
                        className="ml-1 p-2 rounded hover:bg-neutral-200 transition-colors border border-neutral-200 text-neutral-600 hover:text-black focus:outline-none cursor-pointer"
                        onClick={() => setShowGenreModal(true)}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
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
                        Status de Leitura{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={status}
                        onValueChange={(v) => setStatus(v as ReadingStatus)}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          {[
                            {
                              value: "QUERO_LER",
                              label: "Quero Ler",
                              desc: "Livro na lista de desejos",
                            },
                            {
                              value: "LENDO",
                              label: "Lendo",
                              desc: "Livro em progresso",
                            },
                            {
                              value: "LIDO",
                              label: "Lido",
                              desc: "Livro finalizado",
                            },
                            {
                              value: "PAUSADO",
                              label: "Pausado",
                              desc: "Leitura temporariamente interrompida",
                            },
                            {
                              value: "ABANDONADO",
                              label: "Abandonado",
                              desc: "Leitura abandonada",
                            },
                          ].map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {status && (
                        <p className="text-xs text-gray-500 mt-1">
                          {
                            [
                              {
                                value: "QUERO_LER",
                                label: "Quero Ler",
                                desc: "Livro na lista de desejos",
                              },
                              {
                                value: "LENDO",
                                label: "Lendo",
                                desc: "Livro em progresso",
                              },
                              {
                                value: "LIDO",
                                label: "Lido",
                                desc: "Livro finalizado",
                              },
                              {
                                value: "PAUSADO",
                                label: "Pausado",
                                desc: "Leitura temporariamente interrompida",
                              },
                              {
                                value: "ABANDONADO",
                                label: "Abandonado",
                                desc: "Leitura abandonada",
                              },
                            ].find((opt) => opt.value === status)?.desc
                          }
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium">
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
                      <label className="block text-sm font-medium">
                        Página Atual
                      </label>
                      <Input
                        placeholder="Página atual da leitura"
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
                        <span className="text-xs text-gray-400">
                          Sem avaliação
                        </span>
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
                      <label className="block text-sm font-medium">
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
                    <label className="block text-sm font-medium">
                      URL da Capa
                    </label>
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
                    disabled={updating || !isValid || !isChanged}
                    type="submit"
                  >
                    {updating ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Save className="h-5 w-5" />
                    )}
                    Salvar Alterações
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full cursor-pointer"
                    type="button"
                    onClick={() => router.back()}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </>
      )}
      {showGenreModal && (
        <GenreModal
          open={showGenreModal}
          onClose={() => setShowGenreModal(false)}
          onGenresChange={setGenres}
        />
      )}
    </div>
  );
}
