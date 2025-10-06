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

export async function GET() {
  const books = await readBooks();
  const total = books.length;
  const lendo = books.filter((b) => b.status === "LENDO").length;
  const finalizados = books.filter((b) => b.status === "LIDO").length;
  const paginas = books.reduce((acc, b) => acc + (b.pages || 0), 0);
  const recentes = [...books].slice(-3).reverse();
  return NextResponse.json({
    stats: { total, lendo, finalizados, paginas },
    recentes,
  });
}
