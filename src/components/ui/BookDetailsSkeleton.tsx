export default function BookDetailsSkeleton() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-2xl border p-6 flex flex-col md:flex-row gap-8 animate-pulse">
        {/* Capa do livro */}
        <div className="w-full md:w-[260px] flex flex-col items-center">
          <div className="rounded-md bg-neutral-200 border w-[180px] h-[260px] mb-4" />
        </div>
        {/* Detalhes do livro */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="h-7 w-2/3 bg-neutral-200 rounded" />
          <div className="h-5 w-1/3 bg-neutral-200 rounded" />
          <div className="flex gap-2">
            <div className="h-5 w-20 bg-neutral-200 rounded-full" />
            <div className="h-5 w-16 bg-neutral-200 rounded-full" />
          </div>
          <div className="h-4 w-1/2 bg-neutral-200 rounded" />
          <div className="h-4 w-1/4 bg-neutral-200 rounded" />
          <div className="h-4 w-1/3 bg-neutral-200 rounded" />
          <div className="h-4 w-1/2 bg-neutral-200 rounded" />
          <div className="h-4 w-1/4 bg-neutral-200 rounded" />
        </div>
      </div>
    </div>
  );
}
