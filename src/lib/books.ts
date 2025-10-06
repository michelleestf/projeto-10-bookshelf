import { prisma } from "./prisma";

export const genres = [
  "Literatura Brasileira",
  "Ficção Científica",
  "Realismo Mágico",
  "Ficção",
  "Fantasia",
  "Romance",
  "Biografia",
  "História",
  "Autoajuda",
  "Tecnologia",
  "Programação",
  "Negócios",
  "Psicologia",
  "Filosofia",
  "Poesia",
];

export type Genre = (typeof genres)[number];
export type ReadingStatus =
  | "QUERO_LER"
  | "LENDO"
  | "LIDO"
  | "PAUSADO"
  | "ABANDONADO";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre?: Genre | { id: string; name: string };
  year?: number;
  pages?: number;
  rating?: number;
  synopsis?: string;
  cover?: string;
  status?: ReadingStatus;
  currentPage?: number;
  notes?: string;
  isbn?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Funções CRUD para livros
export async function getAllBooks() {
  return prisma.book.findMany({
    include: { genre: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getBookById(id: string) {
  return prisma.book.findUnique({
    where: { id },
    include: { genre: true },
  });
}

export async function createBook(
  data: Omit<Book, "id" | "createdAt" | "updatedAt"> & { genre: string }
) {
  return prisma.book.create({
    data: {
      ...data,
      genre: { connect: { name: data.genre } },
    },
    include: { genre: true },
  });
}

export async function updateBook(
  id: string,
  data: Partial<Book> & { genre?: string }
) {
  const updateData: any = { ...data };
  if (data.genre) {
    updateData.genre = { connect: { name: data.genre } };
    delete updateData.genre;
    updateData.genreId = undefined;
  }
  return prisma.book.update({
    where: { id },
    data: updateData,
    include: { genre: true },
  });
}

export async function deleteBook(id: string) {
  return prisma.book.delete({ where: { id } });
}

// Funções para gêneros
export async function getAllGenres() {
  return prisma.genre.findMany({ orderBy: { name: "asc" } });
}

export async function getGenreByName(name: string) {
  return prisma.genre.findUnique({ where: { name } });
}
