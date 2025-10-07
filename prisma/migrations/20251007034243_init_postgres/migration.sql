-- CreateEnum
CREATE TYPE "ReadingStatus" AS ENUM ('QUERO_LER', 'LENDO', 'LIDO', 'PAUSADO', 'ABANDONADO');

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "genreId" TEXT NOT NULL,
    "status" "ReadingStatus" NOT NULL DEFAULT 'QUERO_LER',
    "currentPage" INTEGER,
    "pages" INTEGER,
    "year" INTEGER,
    "rating" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isbn" TEXT,
    "notes" TEXT,
    "synopsis" TEXT,
    "cover" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- AddForeignKey
ALTER TABLE "Book" ADD CONSTRAINT "Book_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
