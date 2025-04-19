
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Quotation } from '@/domain/quotation/models/quotation.model';
import { quotationService } from '@/domain/quotation/services/quotation.service';
import { createEntityId, createStatus } from '@/core/domain/types/value-objects';

export const useQuotationActions = (onRefresh: () => void) => {
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
        await quotationService.delete(selectedQuotation.id);
        
        toast({
          title: "Cotización eliminada",
          description: `La cotización ${selectedQuotation.number} ha sido eliminada`,
        });
        
        setDeleteDialogOpen(false);
        setSelectedQuotation(null);
        onRefresh();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        toast({
          variant: "destructive",
          title: "Error al eliminar",
          description: errorMessage,
        });
      }
    }
  };

  const handleStatusChange = async (quotation: Quotation, status: Quotation['status']) => {
    try {
      await quotationService.updateStatus(quotation.id, createStatus(status));
      
      const statusMessages = {
        draft: "borrador",
        sent: "enviada",
        approved: "aprobada", 
        rejected: "rechazada",
        expired: "expirada"
      };
      
      toast({
        title: "Estado actualizado",
        description: `La cotización ${quotation.number} ha sido marcada como ${statusMessages[status]}`,
      });
      
      onRefresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      toast({
        variant: "destructive",
        title: "Error al actualizar estado",
        description: errorMessage,
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
};
