import { NextResponse } from "next/server";
import { initialBooks, Book, genres, ReadingStatus } from "@/lib/books";

let books: Book[] = [...initialBooks];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let filtered = books;

    const search = searchParams.get("search")?.toLowerCase();
    const genre = searchParams.get("genre");
    const status = searchParams.get("status");

    if (search) {
      filtered = filtered.filter(
        (b) =>
          b.title?.toLowerCase().includes(search) ||
          b.author?.toLowerCase().includes(search)
      );
    }
    if (genre) {
      filtered = filtered.filter((b) => b.genre === genre);
    }
    if (status) {
      filtered = filtered.filter((b) => b.status === status);
    }

    return NextResponse.json(filtered, { status: 200 });
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
    const { title, author, genre, year } = data;

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
    if (genre !== undefined && typeof genre !== "string") {
      return NextResponse.json(
        { error: "Gênero deve ser uma string." },
        { status: 400 }
      );
    }

    const newBook: Book = {
      id: crypto.randomUUID(),
      title: title.trim(),
      author: author.trim(),
      genre,
      year,
    };
    books.push(newBook);
    return NextResponse.json(newBook, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: "Erro ao criar livro." },
      { status: 500 }
    );
  }
}
