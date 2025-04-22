
import { useState } from 'react';
import { Quotation } from '@/data/models/quotation';
import { useToast } from '@/components/ui/use-toast';
import { updateQuotationStatus, deleteQuotation } from '../../../quotation/services/quotationService';

export function useQuotationActions(onRefresh: () => void) {
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleView = (quotation: Quotation) => {
    toast({
      title: "Ver cotización",
      description: `Viendo detalles de cotización ${quotation.number}`,
    });
    // You would typically navigate to a detail page or open a modal here
  };

  const handleEdit = (quotation: Quotation) => {
    // This function is passed as a prop to components
  };

  const handleDelete = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedQuotation) return;
    
    try {
      await deleteQuotation(selectedQuotation.id);
      toast({
        title: "Cotización eliminada",
        description: `Se ha eliminado la cotización ${selectedQuotation.number}`,
      });
      onRefresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al eliminar",
        description: error instanceof Error ? error.message : "Ocurrió un error al eliminar",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedQuotation(null);
    }
  };

  const handleStatusChange = async (quotation: Quotation, newStatus: Quotation['status']) => {
    try {
      await updateQuotationStatus(quotation.id, newStatus);
      
      const statusMessages = {
        approved: "aprobada",
        rejected: "rechazada",
        sent: "enviada al cliente",
        draft: "movida a borrador",
        expired: "marcada como expirada"
      };
      
      toast({
        title: "Estado actualizado",
        description: `La cotización ${quotation.number} ha sido ${statusMessages[newStatus]}.`,
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
