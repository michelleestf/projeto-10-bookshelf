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
  const bookData: any = {};
  bookData.title = data.title;
  bookData.author = data.author;
  if (data.status) bookData.status = data.status;
  if (data.pages !== undefined) bookData.pages = data.pages;
  if (data.currentPage !== undefined) bookData.currentPage = data.currentPage;
  if (data.year !== undefined) bookData.year = data.year;
  if (data.rating !== undefined) bookData.rating = data.rating;
  if (data.synopsis) bookData.synopsis = data.synopsis;
  if (data.notes) bookData.notes = data.notes;
  if (data.cover) bookData.cover = data.cover;
  if (data.isbn) bookData.isbn = data.isbn;
  if (data.genre) {
    bookData.genre = { connect: { name: data.genre } };
  }
  return prisma.book.create({
    data: bookData,
    include: { genre: true },
  });
}

export async function updateBook(
  id: string,
  data: Partial<Book> & { genre?: string }
) {
  const updateData: any = {};
  if (data.title) updateData.title = data.title;
  if (data.author) updateData.author = data.author;
  if (data.status) updateData.status = data.status;
  if (data.pages !== undefined) updateData.pages = data.pages;
  if (data.currentPage !== undefined) updateData.currentPage = data.currentPage;
  if (data.year !== undefined) updateData.year = data.year;
  if (data.rating !== undefined) updateData.rating = data.rating;
  if (data.synopsis) updateData.synopsis = data.synopsis;
  if (data.notes) updateData.notes = data.notes;
  if (data.cover) updateData.cover = data.cover;
  if (data.isbn) updateData.isbn = data.isbn;
  if (data.genre) {
    updateData.genre = { connect: { name: data.genre } };
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

export async function getAllGenres() {
  return prisma.genre.findMany({ orderBy: { name: "asc" } });
}

export async function getGenreByName(name: string) {
  return prisma.genre.findUnique({ where: { name } });
}
