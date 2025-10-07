import { NextResponse } from "next/server";
import { getBookById, updateBook, deleteBook } from "@/lib/books";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const book = await getBookById(params.id);
    if (!book) {
      return NextResponse.json(
        { error: "Livro não encontrado." },
        { status: 404 }
      );
    }
    return NextResponse.json(book, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "Erro ao buscar livro." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const book = await updateBook(params.id, data);
    return NextResponse.json(book, { status: 200 });
  } catch (e: unknown) {
    const error = e as { code?: string };
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Livro não encontrado." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao atualizar livro." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteBook(params.id);
    return new NextResponse(null, { status: 204 });
  } catch (e) {
    const error = e as { code?: string };
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Livro não encontrado." },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Erro ao remover livro." },
      { status: 500 }
    );
  }
}
