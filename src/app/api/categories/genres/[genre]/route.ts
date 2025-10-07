import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ genre: string }> }
) {
  try {
    const { genre } = await context.params;
    const genreParam = decodeURIComponent(genre);
    const genreRecord = await prisma.genre.findUnique({
      where: { name: genreParam },
    });
    if (!genreRecord) {
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
