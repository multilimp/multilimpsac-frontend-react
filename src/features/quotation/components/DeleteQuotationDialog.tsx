
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Quotation } from '@/features/quotation/models/quotation';

interface DeleteQuotationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  quotation: Quotation | null;
  onConfirmDelete: () => void;
}

const DeleteQuotationDialog: React.FC<DeleteQuotationDialogProps> = ({
  isOpen,
  onOpenChange,
  quotation,
  onConfirmDelete,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogDescription>
            ¿Está seguro que desea eliminar la cotización {quotation?.number}?
            Esta acción no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmDelete}
          >
            Eliminar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteQuotationDialog;
