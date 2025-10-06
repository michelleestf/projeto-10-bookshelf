import { NextResponse } from "next/server";
import { genres as initialGenres } from "@/lib/books";

declare global {
  var genresArray: string[] | undefined;
}
let genres: string[] =
  globalThis.genresArray || (globalThis.genresArray = [...initialGenres]);

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
    if (genres.some((g) => g.toLowerCase() === genreName.toLowerCase())) {
      return NextResponse.json({ error: "Gênero já existe." }, { status: 409 });
    }
    genres.push(genreName);
    return NextResponse.json({ name: genreName }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao adicionar gênero." },
      { status: 500 }
    );
  }
}
