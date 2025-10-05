import { NextResponse } from "next/server";
import { genres as initialGenres } from "@/lib/books";

declare global {
  var genresArray: string[] | undefined;
}
let genres: string[] =
  globalThis.genresArray || (globalThis.genresArray = [...initialGenres]);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    if (request.method === "DELETE" || searchParams.get("delete")) {
      const name = searchParams.get("name");
      if (!name) {
        return NextResponse.json(
          { error: "Nome do gênero é obrigatório para deletar." },
          { status: 400 }
        );
      }
      const idx = genres.findIndex(
        (g) => g.toLowerCase() === name.toLowerCase()
      );
      if (idx === -1) {
        return NextResponse.json(
          { error: "Gênero não encontrado." },
          { status: 404 }
        );
      }
      genres.splice(idx, 1);
      return new NextResponse(null, { status: 204 });
    }
    const data = genres.map((name) => ({ name }));
    return NextResponse.json(data, { status: 200 });
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
