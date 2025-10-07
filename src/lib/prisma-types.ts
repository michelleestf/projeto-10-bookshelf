import { PrismaClient, Prisma } from "@prisma/client";

export type BookCreateInput = Prisma.BookCreateInput;
export type GenreCreateNestedOneWithoutBooksInput =
  Prisma.GenreCreateNestedOneWithoutBooksInput;
