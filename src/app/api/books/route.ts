import { NextResponse } from "next/server";
import { getAllBooks, createBook } from "@/lib/books";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams
      .get("search")
      ?.toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "");
    const genre = searchParams.get("genre");
    const status = searchParams.get("status");

    let books = await getAllBooks();

    if (search) {
      books = books.filter((b) => {
        const title = b.title
          ?.toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "");
        const author = b.author
          ?.toLowerCase()
          .normalize("NFD")
          .replace(/\p{Diacritic}/gu, "");
        return title?.includes(search) || author?.includes(search);
      });
    }
    if (genre) {
      books = books.filter((b) => b.genre?.name === genre);
    }
    if (status) {
      books = books.filter((b) => b.status === status);
    }

    return NextResponse.json(books, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar livros." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const book = await createBook(data);
    return NextResponse.json(book, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao criar livro." },
      { status: 500 }
    );
  }
}
