import { NextResponse } from "next/server";
import { initialBooks, Book } from "@/lib/books";
import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/lib/books-data.json");

async function readBooks(): Promise<Book[]> {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    const books = JSON.parse(data);
    if (Array.isArray(books)) return books;
    return [];
  } catch {
    // Se não existir, retorna os iniciais
    return [...initialBooks];
  }
}

async function writeBooks(books: Book[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(books, null, 2), "utf-8");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let books = await readBooks();

    const search = searchParams.get("search")?.toLowerCase();
    const genre = searchParams.get("genre");
    const status = searchParams.get("status");

    if (search) {
      books = books.filter(
        (b) =>
          b.title?.toLowerCase().includes(search) ||
          b.author?.toLowerCase().includes(search)
      );
    }
    if (genre) {
      books = books.filter((b) => b.genre === genre);
    }
    if (status) {
      books = books.filter((b) => b.status === status);
    }

    return NextResponse.json(books, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Erro ao buscar livros." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const {
      title,
      author,
      genre,
      year,
      pages,
      rating,
      synopsis,
      cover,
      status,
      currentPage,
      notes,
      isbn,
    } = data;

    if (!title || typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        { error: "Título é obrigatório." },
        { status: 400 }
      );
    }
    if (!author || typeof author !== "string" || !author.trim()) {
      return NextResponse.json(
        { error: "Autor é obrigatório." },
        { status: 400 }
      );
    }
    if (year !== undefined && typeof year !== "number") {
      return NextResponse.json(
        { error: "Ano deve ser um número." },
        { status: 400 }
      );
    }
    if (pages !== undefined && typeof pages !== "number") {
      return NextResponse.json(
        { error: "Páginas deve ser um número." },
        { status: 400 }
      );
    }
    if (rating !== undefined && typeof rating !== "number") {
      return NextResponse.json(
        { error: "Avaliação deve ser um número." },
        { status: 400 }
      );
    }
    if (genre !== undefined && typeof genre !== "string") {
      return NextResponse.json(
        { error: "Gênero deve ser uma string." },
        { status: 400 }
      );
    }
    if (synopsis !== undefined && typeof synopsis !== "string") {
      return NextResponse.json(
        { error: "Sinopse deve ser uma string." },
        { status: 400 }
      );
    }
    if (cover !== undefined && typeof cover !== "string") {
      return NextResponse.json(
        { error: "Capa deve ser uma string (URL)." },
        { status: 400 }
      );
    }
    if (status !== undefined && typeof status !== "string") {
      return NextResponse.json(
        { error: "Status deve ser uma string." },
        { status: 400 }
      );
    }
    if (currentPage !== undefined && typeof currentPage !== "number") {
      return NextResponse.json(
        { error: "Página atual deve ser um número." },
        { status: 400 }
      );
    }
    if (notes !== undefined && typeof notes !== "string") {
      return NextResponse.json(
        { error: "Notas deve ser uma string." },
        { status: 400 }
      );
    }
    if (isbn !== undefined && typeof isbn !== "string") {
      return NextResponse.json(
        { error: "ISBN deve ser uma string." },
        { status: 400 }
      );
    }

    let books = await readBooks();
    const now = new Date();
    const addedAt = now.toISOString();
    const newBook: Book = {
      id: crypto.randomUUID(),
      title: title.trim(),
      author: author.trim(),
      genre,
      year,
      pages,
      rating,
      synopsis,
      cover,
      status,
      currentPage,
      notes,
      isbn,
      addedAt,
    };
    books.push(newBook);
    await writeBooks(books);
    return NextResponse.json(newBook, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: "Erro ao criar livro." },
      { status: 500 }
    );
  }
}
