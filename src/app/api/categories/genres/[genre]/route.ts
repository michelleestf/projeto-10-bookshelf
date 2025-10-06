import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  _req: Request,
  { params }: { params: { genre: string } }
) {
  try {
    const genreParam = decodeURIComponent(params.genre);
    const genre = await prisma.genre.findUnique({
      where: { name: genreParam },
    });
    if (!genre) {
      return NextResponse.json(
        { error: "Gênero não encontrado." },
        { status: 404 }
      );
    }
    await prisma.genre.delete({ where: { name: genreParam } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao remover gênero." },
      { status: 500 }
    );
  }
}
