import { Button } from "@/components/ui/button";
import { BookX } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NotFound({
  message = "O recurso que você procura não existe ou foi removido.",
}: {
  message?: string;
}) {
  const router = useRouter();
  return (
    <div className="max-w-xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-6">
      <BookX size={64} className="text-red-500 mb-2" />
      <h1 className="text-3xl font-bold mb-2">Página não encontrada</h1>
      <p className="text-neutral-600 text-lg mb-4">{message}</p>
      <Button
        variant="outline"
        className="px-6 py-2 text-base font-semibold cursor-pointer"
        onClick={() => router.back()}
      >
        Voltar
      </Button>
    </div>
  );
}
