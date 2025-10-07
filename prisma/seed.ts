import { PrismaClient, ReadingStatus } from "@prisma/client";
import fs from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  // Lê o JSON antigo
  const jsonPath = path.join(__dirname, "../src/lib/books-data.json");
  const raw = await fs.readFile(jsonPath, "utf-8");
  const books: any[] = JSON.parse(raw);

  // Gêneros únicos
  const genresSet = new Set<string>();
  books.forEach((b) => {
    if (b.genre) genresSet.add(b.genre);
  });
  const genres = Array.from(genresSet);

  // Cria gêneros
  const genreMap: Record<string, string> = {};
  for (const name of genres) {
    const genre = await prisma.genre.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    genreMap[name] = genre.id;
  }

  // Cria livros
  for (const b of books) {
    await prisma.book.upsert({
      where: { id: b.id },
      update: {},
      create: {
        id: b.id,
        title: b.title,
        author: b.author,
        genreId: genreMap[b.genre],
        status:
          typeof b.status === "string" &&
          Object.values(ReadingStatus).includes(b.status as ReadingStatus)
            ? (b.status as ReadingStatus)
            : "QUERO_LER",
        currentPage: b.currentPage ?? undefined,
        pages: b.pages ?? undefined,
        createdAt: b.createdAt ? new Date(b.createdAt) : undefined,
        updatedAt: b.updatedAt ? new Date(b.updatedAt) : undefined,
        isbn: b.isbn ?? undefined,
        notes: b.notes ?? undefined,
        synopsis: b.synopsis ?? undefined,
        cover: b.cover ?? undefined,
      },
    });
  }

  console.log("Seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
