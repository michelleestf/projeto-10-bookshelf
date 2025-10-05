import { NextResponse } from "next/server";
import { initialBooks, Book } from "@/lib/books";

declare global {
  var booksArray: Book[] | undefined;
}
let books: Book[] =
  globalThis.booksArray || (globalThis.booksArray = [...initialBooks]);

function findBookIndex(id: string) {
  return books.findIndex((b) => b.id === id);
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const idx = findBookIndex(params.id);
    if (idx === -1) {
      return NextResponse.json(
        { error: "Livro não encontrado." },
        { status: 404 }
      );
    }
    return NextResponse.json(books[idx], { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar livro." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const idx = findBookIndex(params.id);
    if (idx === -1) {
      return NextResponse.json(
        { error: "Livro não encontrado." },
        { status: 404 }
      );
    }
    const data = await req.json();
    const { title, author, genre, year } = data;

    if (title !== undefined && (typeof title !== "string" || !title.trim())) {
      return NextResponse.json({ error: "Título inválido." }, { status: 400 });
    }
    if (
      author !== undefined &&
      (typeof author !== "string" || !author.trim())
    ) {
      return NextResponse.json({ error: "Autor inválido." }, { status: 400 });
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

    const book = books[idx];
    if (title !== undefined) book.title = title.trim();
    if (author !== undefined) book.author = author.trim();
    if (genre !== undefined) book.genre = genre;
    if (year !== undefined) book.year = year;

    books[idx] = book;
    return NextResponse.json(book, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao atualizar livro." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const idx = findBookIndex(params.id);
    if (idx === -1) {
      return NextResponse.json(
        { error: "Livro não encontrado." },
        { status: 404 }
      );
    }
    books.splice(idx, 1);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao remover livro." },
      { status: 500 }
    );
  }
}
