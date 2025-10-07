export default function BookCardSkeleton() {
  return (
    <div className="p-4 bg-card rounded-xl border border-border flex items-center gap-6 min-h-[100px] animate-pulse">
      {/* Capa do livro */}
      <div className="w-[56px] h-[80px] flex items-center justify-center flex-shrink-0">
        <div className="rounded-md bg-muted border border-border w-[56px] h-[80px]" />
      </div>
      {/* Informações do livro */}
      <div className="flex-1 min-w-0">
        <div className="h-5 bg-muted rounded mb-1" />
        <div className="h-4 bg-muted rounded mb-2" />
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <div className="h-5 w-20 bg-muted rounded-full" />
          <div className="h-5 w-16 bg-muted rounded-full" />
        </div>
      </div>
    </div>
  );
}
