
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Quotation } from "@/data/models/quotation";
import DataTable from "@/components/common/DataTable";
import DeleteQuotationDialog from "./DeleteQuotationDialog";
import { getQuotationColumns } from "./QuotationColumns";
import { fetchQuotations, updateQuotationStatus, deleteQuotation } from "@/data/services/quotationService";

const QuotationList: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const columns = getQuotationColumns();

  useEffect(() => {
    loadQuotations();
  }, []);

  const loadQuotations = async () => {
    try {
      setIsLoading(true);
      const data = await fetchQuotations();
      setQuotations(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al cargar cotizaciones",
        description: error instanceof Error ? error.message : "Ocurrió un error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (quotation: Quotation) => {
    toast({
      title: "Editar cotización",
      description: `Editando cotización ${quotation.number}`,
    });
  };

  const handleView = (quotation: Quotation) => {
    toast({
      title: "Ver cotización",
      description: `Viendo detalles de cotización ${quotation.number}`,
    });
  };

  const handleDelete = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (selectedQuotation) {
      try {
        await deleteQuotation(selectedQuotation.id);
        setQuotations(quotations.filter(q => q.id !== selectedQuotation.id));
        toast({
          title: "Cotización eliminada",
          description: `Se ha eliminado la cotización ${selectedQuotation.number}`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error al eliminar",
          description: error instanceof Error ? error.message : "Ocurrió un error al eliminar la cotización",
        });
      } finally {
        setDeleteDialogOpen(false);
      }
    }
  };

  const handleStatusChange = async (quotation: Quotation, newStatus: Quotation['status']) => {
    try {
      await updateQuotationStatus(quotation.id, newStatus);
      
      setQuotations(
        quotations.map(q => 
          q.id === quotation.id ? { ...q, status: newStatus } : q
        )
      );
      
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
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al actualizar estado",
        description: error instanceof Error ? error.message : "Ocurrió un error al actualizar el estado",
      });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <DataTable 
          columns={columns} 
          data={quotations}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={isLoading}
        />
        
        <DeleteQuotationDialog 
          isOpen={deleteDialogOpen} 
          onOpenChange={setDeleteDialogOpen}
          quotation={selectedQuotation}
          onConfirmDelete={confirmDelete}
        />
      </CardContent>
    </Card>
  );
};

export default QuotationList;
