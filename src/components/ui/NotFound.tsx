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
    <div className="max-w-xl mx-auto px-6 py-20 flex flex-col items-center text-center gap-6 dark:bg-gray-900 dark:text-gray-100 rounded-xl">
      <BookX size={64} className="text-red-500 mb-2" />
      <h1 className="text-3xl font-bold mb-2">Página não encontrada</h1>
      <p className="text-neutral-600 dark:text-gray-400 text-lg mb-4">
        {message}
      </p>
      <div className="w-full flex justify-center">
        <Button
          variant="outline"
          className="px-6 py-2 text-base font-semibold w-full sm:w-auto cursor-pointer"
          onClick={() => router.back()}
        >
          Voltar
        </Button>
      </div>
    </div>
  );
}
