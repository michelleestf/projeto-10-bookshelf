import { prisma } from "./prisma";
import {
  BookCreateInput,
  GenreCreateNestedOneWithoutBooksInput,
} from "./prisma-types";

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
  const bookData: BookCreateInput = {
    title: data.title!,
    author: data.author!,
    status: data.status,
    pages: data.pages,
    currentPage: data.currentPage,
    year: data.year,
    rating: data.rating,
    synopsis: data.synopsis,
    notes: data.notes,
    cover: data.cover,
    isbn: data.isbn,
    genre: { connect: { name: data.genre || genres[0] } },
  };
  return prisma.book.create({
    data: bookData,
    include: { genre: true },
  });
}

export async function updateBook(
  id: string,
  data: Partial<Book> & { genre?: string }
) {
  const updateData: {
    title?: string;
    author?: string;
    status?: ReadingStatus;
    pages?: number;
    currentPage?: number;
    year?: number;
    rating?: number;
    synopsis?: string;
    notes?: string;
    cover?: string;
    isbn?: string;
    genre?: { connect: { name: string } };
  } = {
    ...(data.title && { title: data.title }),
    ...(data.author && { author: data.author }),
    ...(data.status && { status: data.status }),
    ...(data.pages !== undefined && { pages: data.pages }),
    ...(data.currentPage !== undefined && { currentPage: data.currentPage }),
    ...(data.year !== undefined && { year: data.year }),
    ...(data.rating !== undefined && { rating: data.rating }),
    ...(data.synopsis && { synopsis: data.synopsis }),
    ...(data.notes && { notes: data.notes }),
    ...(data.cover && { cover: data.cover }),
    ...(data.isbn && { isbn: data.isbn }),
    ...(data.genre && { genre: { connect: { name: data.genre } } }),
  };
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
