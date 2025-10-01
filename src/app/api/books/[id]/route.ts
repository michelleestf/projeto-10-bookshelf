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

// GET /api/books/:id
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const books = loadBooks();
  const book = books.find(b => b.id === params.id);
  if (!book) return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });
  return NextResponse.json(book);
}

// PUT /api/books/:id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const books = loadBooks();
    const index = books.findIndex(b => b.id === params.id);
    if (index === -1) return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });

    books[index] = { ...books[index], ...body }; // atualiza os campos
    saveBooks(books);
    return NextResponse.json(books[index]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao atualizar livro" }, { status: 500 });
  }
}

// DELETE /api/books/:id
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const books = loadBooks();
    const index = books.findIndex(b => b.id === params.id);
    if (index === -1) return NextResponse.json({ error: "Livro não encontrado" }, { status: 404 });

    const deleted = books.splice(index, 1);
    saveBooks(books);
    return NextResponse.json(deleted[0]);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erro ao excluir livro" }, { status: 500 });
  }
}
