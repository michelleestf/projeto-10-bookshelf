import { NextResponse } from "next/server";
import { Book } from "@/lib/books";
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
    return [];
  }
}

async function writeBooks(books: Book[]) {
  await fs.writeFile(DATA_PATH, JSON.stringify(books, null, 2), "utf-8");
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const books = await readBooks();
    const book = books.find((b) => b.id === params.id);
    if (!book) {
      return NextResponse.json(
        { error: "Livro não encontrado." },
        { status: 404 }
      );
    }
    return NextResponse.json(book, { status: 200 });
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
    const books = await readBooks();
    const idx = books.findIndex((b) => b.id === params.id);
    if (idx === -1) {
      return NextResponse.json(
        { error: "Livro não encontrado." },
        { status: 404 }
      );
    }
    const data = await req.json();
    if (
      data.title !== undefined &&
      (typeof data.title !== "string" || !data.title.trim())
    ) {
      return NextResponse.json({ error: "Título inválido." }, { status: 400 });
    }
    if (
      data.author !== undefined &&
      (typeof data.author !== "string" || !data.author.trim())
    ) {
      return NextResponse.json({ error: "Autor inválido." }, { status: 400 });
    }
    if (data.year !== undefined && typeof data.year !== "number") {
      return NextResponse.json(
        { error: "Ano deve ser um número." },
        { status: 400 }
      );
    }
    if (data.genre !== undefined && typeof data.genre !== "string") {
      return NextResponse.json(
        { error: "Gênero deve ser uma string." },
        { status: 400 }
      );
    }

    const book = books[idx];
    const update: any = { ...data };
    if (typeof update.title === "string") update.title = update.title.trim();
    if (typeof update.author === "string") update.author = update.author.trim();
    update.updatedAt = new Date().toISOString();
    Object.assign(book, update);
    books[idx] = book;
    await writeBooks(books);
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
    const books = await readBooks();
    const idx = books.findIndex((b) => b.id === params.id);
    if (idx === -1) {
      return NextResponse.json(
        { error: "Livro não encontrado." },
        { status: 404 }
      );
    }
    books.splice(idx, 1);
    await writeBooks(books);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao remover livro." },
      { status: 500 }
    );
  }
}
