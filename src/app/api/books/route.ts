import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "books.json");

function loadBooks() {
  if (!fs.existsSync(filePath)) return [];
  const data = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(data);
}

function saveBooks(books: any[]) {
  fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
}

// GET /api/books
export async function GET() {
  const books = loadBooks();
  return NextResponse.json(books);
}

// POST /api/books
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const books = loadBooks();

    const newBook = {
      id: Date.now().toString(),
      title: body.title,
      author: body.author,
      pages: body.pages ?? null,
      currentPage: body.currentPage ?? null,
      status: body.status ?? "QUERO_LER",
      genre: body.genre ?? null,
      rating: body.rating ?? 0,
      cover: body.cover ?? null,
      synopsis: body.synopsis ?? null,
    };

    books.push(newBook);
    saveBooks(books);

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar livro:", error);
    return NextResponse.json({ error: "Erro ao criar livro" }, { status: 500 });
  }
}
