import { NextResponse } from "next/server";
import { genres as initialGenres } from "@/lib/books";

declare global {
  var genresArray: string[] | undefined;
}
let genres: string[] =
  globalThis.genresArray || (globalThis.genresArray = [...initialGenres]);

export async function DELETE(
  _req: Request,
  { params }: { params: { genre: string } }
) {
  try {
    const genreParam = decodeURIComponent(params.genre);
    const idx = genres.findIndex(
      (g) => g.toLowerCase() === genreParam.toLowerCase()
    );
    if (idx === -1) {
      return NextResponse.json(
        { error: "Gênero não encontrado." },
        { status: 404 }
      );
    }
    genres.splice(idx, 1);
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao remover gênero." },
      { status: 500 }
    );
  }
}
