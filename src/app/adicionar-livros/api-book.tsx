import { NextResponse } from "next/server";
import { Book } from "@/lib/books";

const books: Book[] = []; // memória (cada vez que reinicia o server, limpa)

export async function GET() {
  return NextResponse.json(books);
}

export async function POST(req: Request) {
  const body: Book = await req.json();
  books.push(body);
  return NextResponse.json(
    { message: "Livro adicionado", book: body },
    { status: 201 }
  );
}
