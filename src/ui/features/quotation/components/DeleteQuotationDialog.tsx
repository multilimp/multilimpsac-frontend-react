
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Quotation } from "@/domain/quotation/models/quotation.model";

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
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente la cotización
            {quotation && ` ${quotation.number}`} y todos sus datos asociados.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmDelete} className="bg-red-600">
            Eliminar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteQuotationDialog;
