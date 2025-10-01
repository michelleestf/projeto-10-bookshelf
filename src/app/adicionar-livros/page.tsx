"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { StarRating } from "@/components/ui/StarRating";
import { ReadingStatusSelect, type ReadingStatus } from "@/components/ui/ReadingStatusSelect";
import { toast } from "sonner";
import Image from "next/image";

type Livro = {
  id: string;
  titulo: string;
  autor: string;
  totalPaginas?: number;
  paginaAtual?: number;
  statusLeitura: ReadingStatus;
  isbn?: string;
  urlCapa?: string;
  genero?: string;
  avaliacao: number;
  notasPessoais?: string;
};

export default function AddBookPage() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [totalPaginas, setTotalPaginas] = useState<number | "">("");
  const [paginaAtual, setPaginaAtual] = useState<number | "">("");
  const [statusLeitura, setStatusLeitura] = useState<ReadingStatus>("QUERO_LER");
  const [isbn, setIsbn] = useState("");
  const [urlCapa, setUrlCapa] = useState("");
  const [genero, setGenero] = useState("");
  const [avaliacao, setAvaliacao] = useState<number>(0);
  const [notasPessoais, setNotasPessoais] = useState("");

  const [errors, setErrors] = useState<{
    titulo?: string;
    autor?: string;
    urlCapa?: string;
  }>({});
  const [urlCapaValida, setUrlCapaValida] = useState(false);

  // validação da URL da capa
  useEffect(() => {
    if (!urlCapa) {
      setUrlCapaValida(false);
      return;
    }
    try {
      new URL(urlCapa);
      setUrlCapaValida(true);
    } catch {
      setUrlCapaValida(false);
    }
  }, [urlCapa]);

  // progresso de preenchimento
  const progresso = () => {
    let totalCampos = 3; // título, autor e status são obrigatórios
    let preenchidos = 0;
    if (titulo.trim()) preenchidos++;
    if (autor.trim()) preenchidos++;
    preenchidos++; // status sempre tem valor padrão

    totalCampos += 6; // campos opcionais
    if (totalPaginas !== "") preenchidos++;
    if (paginaAtual !== "") preenchidos++;
    if (urlCapa.trim()) preenchidos++;
    if (genero.trim()) preenchidos++;
    if (avaliacao > 0) preenchidos++;
    if (notasPessoais.trim()) preenchidos++;

    return Math.round((preenchidos / totalCampos) * 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};
    if (!titulo.trim()) newErrors.titulo = "Título é obrigatório";
    if (!autor.trim()) newErrors.autor = "Autor é obrigatório";
    if (urlCapa && !urlCapaValida) newErrors.urlCapa = "URL da capa inválida";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const livro: Livro = {
      id: crypto.randomUUID(),
      titulo: titulo.trim(),
      autor: autor.trim(),
      totalPaginas: totalPaginas === "" ? undefined : Number(totalPaginas),
      paginaAtual: paginaAtual === "" ? undefined : Number(paginaAtual),
      statusLeitura,
      isbn: isbn.trim() || undefined,
      urlCapa: urlCapa.trim() || undefined,
      genero: genero.trim() || undefined,
      avaliacao,
      notasPessoais: notasPessoais.trim() || undefined,
    };

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: livro.titulo,
          author: livro.autor,
          pages: livro.totalPaginas,
          currentPage: livro.paginaAtual,
          status: livro.statusLeitura,
          genre: livro.genero,
          rating: livro.avaliacao,
          cover: livro.urlCapa,
          synopsis: livro.notasPessoais,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar livro");
      }

      const savedBook = await response.json();
      console.log("Livro salvo:", savedBook);
      toast.success("Livro adicionado com sucesso 🚀");
      router.push("/biblioteca");
    } catch (error) {
      console.error("Erro ao salvar livro:", error);
      toast.error("Não foi possível adicionar o livro");
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-10">
      <div>
        <h1 className="text-4xl font-bold mb-2">Adicionar Livro</h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Preencha os campos abaixo para cadastrar um novo livro
        </p>
      </div>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="bg-card shadow-sm rounded-xl p-6 space-y-4"
      >
        <div>
          <Input
            placeholder="Título *"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          {errors.titulo && (
            <p className="text-destructive text-sm">{errors.titulo}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Autor *"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
          />
          {errors.autor && (
            <p className="text-destructive text-sm">{errors.autor}</p>
          )}
        </div>

        <Input
          placeholder="Total de páginas"
          type="number"
          value={totalPaginas}
          onChange={(e) =>
            setTotalPaginas(e.target.value ? Number(e.target.value) : "")
          }
        />

        <Input
          placeholder="Página atual"
          type="number"
          value={paginaAtual}
          onChange={(e) =>
            setPaginaAtual(e.target.value ? Number(e.target.value) : "")
          }
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Status de Leitura
          </label>
          <ReadingStatusSelect
            value={statusLeitura}
            onValueChange={setStatusLeitura}
          />
        </div>

        <Input
          placeholder="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />

        <div>
          <Input
            placeholder="URL da capa"
            value={urlCapa}
            onChange={(e) => setUrlCapa(e.target.value)}
          />
          {errors.urlCapa && (
            <p className="text-destructive text-sm">{errors.urlCapa}</p>
          )}
        </div>

        {urlCapaValida && (
          <div className="w-32 h-auto border rounded overflow-hidden">
            <Image
              src={urlCapa}
              alt="Preview da Capa"
              width={128}
              height={192}
              className="object-cover w-full h-auto"
            />
          </div>
        )}

        <Input
          placeholder="Gênero"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Avaliação
          </label>
          <StarRating
            rating={avaliacao}
            onRatingChange={setAvaliacao}
            className="mb-2"
          />
        </div>

        <Textarea
          placeholder="Notas pessoais"
          value={notasPessoais}
          onChange={(e) => setNotasPessoais(e.target.value)}
        />

        <Progress value={progresso()} className="h-2" />

        <Button type="submit" className="w-full">
          Adicionar Livro
        </Button>
      </form>
    </main>
  );
}
