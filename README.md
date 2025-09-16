# 📚 BookShelf

Uma aplicação web moderna para **gerenciamento de biblioteca pessoal**, permitindo catalogar, organizar e acompanhar o progresso de leitura de livros.

## Tecnologias Utilizadas

- **Next.js 15 (App Router)**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui** (biblioteca de componentes)

---

## Funcionalidades

### Dashboard
- Estatísticas gerais da biblioteca:
  - Total de livros cadastrados
  - Livros em leitura
  - Livros finalizados
  - Total de páginas lidas
- Navegação rápida entre seções
- Layout **responsivo** e atrativo

### Biblioteca (Listagem de Livros)
- Exibição em cards com:
    Capa (com fallback padrão)
    Título, autor e ano
    Gênero (badge)
    Avaliação por estrelas ⭐
- Busca por título/autor
- Filtros por gênero literário
- Ações: **visualizar, editar e excluir**

### Adicionar Novo Livro
- Formulário completo com:
    **Obrigatórios:** título, autor
    **Opcionais:** páginas, status de leitura, ISBN, URL da capa, gênero, avaliação e notas pessoais
- Preview em tempo real da capa
- Barra de progresso do preenchimento
- Validação e feedback visual (sucesso/erro)

### Visualizar Livro
- Página individual com todas as informações
- Sinopse detalhada
- Botões de editar e excluir

### Editar Livro
- Formulário pré-preenchido
- Atualização em tempo real

### Excluir Livro
- Confirmação antes da exclusão
- Feedback claro para o usuário

---

## Requisitos de Interface

- **Design System:** shadcn/ui + TailwindCSS
- **Navegação:** header/navbar, breadcrumbs e botões de voltar
- **Formulários:** validação em tempo real e mensagens de erro claras
- **Feedback visual:** toasts, loaders e confirmações

---

## Requisitos Técnicos

- **Responsividade:** mobile-first, grid adaptativo
- **Acessibilidade:** componentes semânticos, labels, contraste adequado
- **Performance:** lazy loading, otimização de imagens, estados de loading
- **UX:** feedback em todas as ações, design consistente e intuitivo

---

## Dados Iniciais

A aplicação inicia com **5 livros pré-cadastrados**, de diferentes gêneros, anos e avaliações, incluindo sinopses completas e URLs de capa válidas.

---

## Como Rodar o Projeto

```bash
# Clone o repositório
git clone https://github.com/michelleestf/projeto-10-bookshelf.git

# Entre no diretório
cd bookshelf-app

# Instale as dependências
npm install

# Rode o projeto em ambiente de desenvolvimento
npm run dev

# Acesse em http://localhost:3000
```

---

## Autor

Projeto desenvolvido pelo Grupo 4 da Turma 1 - Trilha Desenvolvimento Web como parte do **Projeto 10 - Bootcamp Desenvolve Boticário**.
