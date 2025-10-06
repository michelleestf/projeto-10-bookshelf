import { NextResponse } from "next/server";
import { getAllBooks, createBook } from "@/lib/books";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase();
    const genre = searchParams.get("genre");
    const status = searchParams.get("status");

    let books = await getAllBooks();

    if (search) {
      books = books.filter(
        (b) =>
          b.title?.toLowerCase().includes(search) ||
          b.author?.toLowerCase().includes(search)
      );
    }
    if (genre) {
      books = books.filter((b) => b.genre?.name === genre);
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
    // Espera-se que data.genre seja o nome do gênero
    const book = await createBook(data);
    return NextResponse.json(book, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: "Erro ao criar livro." },
      { status: 500 }
    );
  }
}
