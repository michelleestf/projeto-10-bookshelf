import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  // Busca todos os livros
  const books = await prisma.book.findMany({
    include: { genre: true },
    orderBy: { createdAt: "desc" },
  });
  const total = books.length;
  const lendo = books.filter((b) => b.status === "LENDO").length;
  const finalizados = books.filter((b) => b.status === "LIDO").length;
  const paginas = books.reduce((acc, b) => acc + (b.pages || 0), 0);
  const recentes = books.slice(0, 3);
  return NextResponse.json({
    stats: { total, lendo, finalizados, paginas },
    recentes,
  });
}
