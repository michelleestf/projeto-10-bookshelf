export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-6">
      <h1 className="text-3xl font-bold mb-2">Página não encontrada</h1>
      <p className="text-neutral-600 text-lg mb-4">
        O recurso que você procura não existe ou foi removido.
      </p>
    </div>
  );
}
