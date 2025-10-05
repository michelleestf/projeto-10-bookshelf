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
}

export function ConfirmDeleteModal({
  open,
  bookTitle,
  bookId,
  onCancel,
}: ConfirmDeleteModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onCancel();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Tem certeza que deseja excluir <strong>{bookTitle}</strong>?
          </DialogTitle>
          <DialogDescription>
            Essa ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2">
          <Button
            variant="destructive"
            className="w-full cursor-pointer"
            onClick={() => {
              /* lógica de exclusão aqui */
            }}
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
