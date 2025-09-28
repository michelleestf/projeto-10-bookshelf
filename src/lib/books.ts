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
  genre?: string;
  year?: number;
  pages?: number;
  rating?: number;
  synopsis?: string;
  cover?: string;
  status?: ReadingStatus;
  currentPage?: number; // página atual para progresso
}

export const initialBooks: Book[] = [
  {
    id: "1",
    title: "1984",
    author: "George Orwell",
    genre: "Distopia",
    year: 1949,
    currentPage: 150,
    pages: 328,
    rating: 4,
    synopsis: "Um clássico sobre um regime totalitário e vigilância extrema.",
    cover:
      "https://m.media-amazon.com/images/I/71wANojhEKL._UF1000,1000_QL80_.jpg",
    status: "LENDO",
  },
  {
    id: "2",
    title: "Sapiens: Uma Breve História da Humanidade",
    author: "Yuval Noah Harari",
    genre: "História",
    year: 2011,
    pages: 464,
    rating: 5,
    synopsis: "Explora a evolução da espécie humana e suas conquistas.",
    cover: "https://m.media-amazon.com/images/I/71-ghLb8qML.jpg",
    status: "QUERO_LER",
  },
  {
    id: "3",
    title: "Cem Anos de Solidão",
    author: "Gabriel García Márquez",
    genre: "Realismo Mágico",
    year: 1967,
    pages: 417,
    rating: 3,
    synopsis: "A saga da família Buendía na fictícia Macondo.",
    cover: "https://m.media-amazon.com/images/I/817esPahlrL.jpg",
    status: "ABANDONADO",
  },
  {
    id: "4",
    title: "O Senhor dos Anéis: A Sociedade do Anel",
    author: "J.R.R. Tolkien",
    genre: "Fantasia",
    year: 1954,
    pages: 576,
    rating: 5,
    synopsis: "A jornada épica de Frodo e seus amigos para destruir o Um Anel.",
    cover: "https://m.media-amazon.com/images/I/81hCVEC0ExL.jpg",
    status: "LIDO",
  },
  {
    id: "5",
    title: "O Código Limpo",
    author: "Robert C. Martin",
    genre: "Tecnologia",
    year: 2008,
    pages: 464,
    rating: 4,
    synopsis:
      "Princípios e boas práticas para escrever código limpo e sustentável.",
    cover:
      "https://m.media-amazon.com/images/I/4138uiy6ghL._UF1000,1000_QL80_.jpg",
    status: "PAUSADO",
  },
];
