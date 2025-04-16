
import { useState } from 'react';
import { Quotation } from '@/features/quotation/models/quotation';
import { quotationService } from '../services/quotationFormService';
import { useToast } from '@/hooks/use-toast';

export function useQuotationActions(onRefresh: () => void) {
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleView = (quotation: Quotation) => {
    toast({
      title: "Ver cotización",
      description: `Viendo detalles de la cotización ${quotation.number}`,
    });
  };

  const handleEdit = (quotation: Quotation) => {
    toast({
      title: "Editar cotización",
      description: `Editando cotización ${quotation.number}`,
    });
  };

  const handleDelete = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedQuotation) {
      try {
        await quotationService.deleteQuotation(selectedQuotation.id);
        toast({
          title: "Cotización eliminada",
          description: `La cotización ${selectedQuotation.number} ha sido eliminada correctamente.`,
        });
        setDeleteDialogOpen(false);
        onRefresh();
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error al eliminar",
          description: error instanceof Error ? error.message : "Ocurrió un error al eliminar la cotización",
        });
      }
    }
  };

  const handleStatusChange = async (quotation: Quotation, newStatus: Quotation['status']) => {
    try {
      await quotationService.updateQuotationStatus(quotation.id, newStatus);
      
      toast({
        title: "Estado actualizado",
        description: `La cotización ${quotation.number} ha sido actualizada.`,
      });
      
      onRefresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al actualizar estado",
        description: error instanceof Error ? error.message : "Ocurrió un error al actualizar el estado",
      });
    }
  };

  return {
    selectedQuotation,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleView,
    handleEdit,
    handleDelete,
    confirmDelete,
    handleStatusChange
  };
}
