"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type Livro = {
  id: string;
  titulo: string;
  autor: string;
  totalPaginas?: number;
  paginaAtual?: number;
  statusLeitura?: "não iniciado" | "lendo" | "concluído";
  isbn?: string;
  urlCapa?: string;
  genero?: string;
  avaliacao?: number;
  notasPessoais?: string;
};

export default function AddBookPage() {
  const router = useRouter();

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [totalPaginas, setTotalPaginas] = useState<number | "">("");
  const [paginaAtual, setPaginaAtual] = useState<number | "">("");
  const [statusLeitura, setStatusLeitura] = useState<
    "não iniciado" | "lendo" | "concluído"
  >("não iniciado");
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
    let totalCampos = 2;
    let preenchidos = 0;
    if (titulo.trim()) preenchidos++;
    if (autor.trim()) preenchidos++;

    totalCampos += 6;
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
      avaliacao: avaliacao > 0 ? avaliacao : undefined,
      notasPessoais: notasPessoais.trim() || undefined,
    };

    try {
      console.log("Livro salvo:", livro);
      toast.success("Livro adicionado com sucesso 🚀");
      router.push("/books");
    } catch {
      toast.error("Não foi possível adicionar o livro");
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header com título e botão voltar */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Adicionar Livro</h1>
          <p className="text-sm text-gray-600">
            Preencha os campos abaixo para cadastrar um novo livro
          </p>
        </div>
        <Link href="/books">
          <Button variant="outline">Voltar</Button>
        </Link>
      </div>

      {/* Formulário */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-sm rounded-xl p-6 space-y-4"
      >
        <div>
          <Input
            placeholder="Título *"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
          {errors.titulo && (
            <p className="text-red-500 text-sm">{errors.titulo}</p>
          )}
        </div>

        <div>
          <Input
            placeholder="Autor *"
            value={autor}
            onChange={(e) => setAutor(e.target.value)}
          />
          {errors.autor && (
            <p className="text-red-500 text-sm">{errors.autor}</p>
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

        <Select
          value={statusLeitura}
          onValueChange={(v) => setStatusLeitura(v as any)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status de leitura" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="não iniciado">Não iniciado</SelectItem>
            <SelectItem value="lendo">Lendo</SelectItem>
            <SelectItem value="concluído">Concluído</SelectItem>
          </SelectContent>
        </Select>

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
            <p className="text-red-500 text-sm">{errors.urlCapa}</p>
          )}
        </div>

        {urlCapaValida && (
          <img
            src={urlCapa}
            alt="Preview da Capa"
            className="w-32 h-auto border rounded"
          />
        )}

        <Input
          placeholder="Gênero"
          value={genero}
          onChange={(e) => setGenero(e.target.value)}
        />

        <Input
          placeholder="Avaliação (0 a 5)"
          type="number"
          min="0"
          max="5"
          value={avaliacao}
          onChange={(e) => setAvaliacao(Number(e.target.value))}
        />

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
    </div>
  );
}
