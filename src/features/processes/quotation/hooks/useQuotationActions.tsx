
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Quotation as FeatureQuotation } from '@/features/quotation/models/quotation';
import { Quotation as DataQuotation } from '@/data/models/quotation';

// Define a type that works with either quotation model
type AnyQuotation = FeatureQuotation | DataQuotation;

export const useQuotationActions = (onRefresh: () => void) => {
  const [selectedQuotation, setSelectedQuotation] = useState<AnyQuotation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleView = (quotation: AnyQuotation) => {
    toast({
      title: "Ver cotización",
      description: `Viendo detalles de la cotización ${quotation.number}`,
    });
  };

  const handleEdit = (quotation: AnyQuotation) => {
    toast({
      title: "Editar cotización",
      description: `Editando cotización ${quotation.number}`,
    });
  };

  const handleDelete = (quotation: AnyQuotation) => {
    setSelectedQuotation(quotation);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedQuotation) {
      toast({
        title: "Cotización eliminada",
        description: `La cotización ${selectedQuotation.number} ha sido eliminada`,
      });
      
      setDeleteDialogOpen(false);
      setSelectedQuotation(null);
      onRefresh();
    }
  };

  const handleStatusChange = (quotation: AnyQuotation, status: AnyQuotation['status']) => {
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
