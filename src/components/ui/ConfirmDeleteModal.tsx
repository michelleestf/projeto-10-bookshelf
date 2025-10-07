import { toast } from "react-toastify";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";

interface ConfirmDeleteModalProps {
  open: boolean;
  bookTitle: string;
  bookId: string;
  onCancel: () => void;
  onDeleted?: () => void;
}

export function ConfirmDeleteModal({
  open,
  bookTitle,
  bookId,
  onCancel,
  onDeleted,
}: ConfirmDeleteModalProps) {
  async function deleteBook(bookId: string) {
    const res = await fetch(`/api/books/${bookId}`, { method: "DELETE" });
    return res.ok;
  }

  function handleDelete() {
    (async () => {
      try {
        const ok = await deleteBook(bookId);
        if (ok) {
          onCancel();
          if (onDeleted) onDeleted();
          toast.success("Livro excluído com sucesso.");
        } else {
          toast.error("Erro ao excluir livro.");
        }
      } catch {
        toast.error("Erro ao excluir livro.");
      }
    })();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent className="bg-card border-border text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">
            Tem certeza que deseja excluir <strong>{bookTitle}</strong>?
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2">
          <Button
            variant="destructive"
            className="w-full cursor-pointer"
            onClick={handleDelete}
          >
            Sim, excluir
          </Button>
          <Button
            variant="outline"
            className="w-full cursor-pointer"
            onClick={onCancel}
          >
            Não, voltar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
