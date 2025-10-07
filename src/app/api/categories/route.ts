import { NextResponse } from "next/server";
import { getAllGenres, getGenreByName } from "@/lib/books";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const data = await getAllGenres();
    return NextResponse.json(
      data.map((g) => ({ name: g.name })),
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar categorias." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Nome do gênero é obrigatório." },
        { status: 400 }
      );
    }
    const genreName = name.trim();
    const exists = await getGenreByName(genreName);
    if (exists) {
      return NextResponse.json({ error: "Gênero já existe." }, { status: 409 });
    }
    await prisma.genre.create({ data: { name: genreName } });
    return NextResponse.json({ name: genreName }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao adicionar gênero." },
      { status: 500 }
    );
  }
}
