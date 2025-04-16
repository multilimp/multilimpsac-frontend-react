import React, { useState } from 'react';
import {
  DataGrid,
  DataGridColumn
} from '@/components/ui/data-grid';
import { useToast } from '@/components/ui/use-toast';
import { Quotation } from '@/data/models/quotation';
import QuotationStatusBadge from './QuotationStatusBadge';
import QuotationActionMenu from './QuotationActionMenu';
import { updateQuotationStatus, deleteQuotation } from '../services/quotationService';
import { format } from 'date-fns';
import DeleteQuotationDialog from './DeleteQuotationDialog';
import { Card, CardContent } from '@/components/ui/card';

interface QuotationListProps {
  quotations: Quotation[];
  isLoading: boolean;
  onRefresh: () => void;
}

const QuotationList: React.FC<QuotationListProps> = ({
  quotations,
  isLoading,
  onRefresh
}) => {
  const { toast } = useToast();
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Define columns for DataGrid
  const columns: DataGridColumn[] = [
    {
      key: 'number',
      name: 'Número',
      type: 'string',
      sortable: true,
      filterable: true
    },
    {
      key: 'clientName',
      name: 'Cliente',
      type: 'string',
      sortable: true,
      filterable: true
    },
    {
      key: 'date',
      name: 'Fecha',
      type: 'date',
      sortable: true,
      filterable: true
    },
    {
      key: 'expiryDate',
      name: 'Vencimiento',
      type: 'date',
      sortable: true,
      filterable: true
    },
    {
      key: 'total',
      name: 'Total',
      type: 'number',
      sortable: true,
      filterable: true
    },
    {
      key: 'status',
      name: 'Estado',
      type: 'string',
      sortable: true,
      filterable: true
    },
    {
      key: 'actions',
      name: 'Acciones',
      type: 'string',
      sortable: false,
      filterable: false
    }
  ];

  // Handle edit quotation
  const handleEdit = (quotation: Quotation) => {
    toast({
      title: "Editar cotización",
      description: `Editando cotización ${quotation.number}`,
    });
    // You would typically navigate to an edit page or open a modal here
  };

  // Handle view quotation details
  const handleView = (quotation: Quotation) => {
    toast({
      title: "Ver cotización",
      description: `Viendo detalles de cotización ${quotation.number}`,
    });
    // You would typically navigate to a detail page or open a modal here
  };

  // Handle delete quotation
  const handleDelete = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
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

  // Handle status change
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

  // Format data for the grid
  const formattedData = quotations.map(quotation => {
    // Create a copy of the quotation with formatted fields but keeping the original object structure
    return {
      ...quotation,
      formattedDate: format(new Date(quotation.date), 'dd/MM/yyyy'),
      formattedExpiryDate: format(new Date(quotation.expiryDate), 'dd/MM/yyyy'),
      formattedTotal: `$${quotation.total.toLocaleString('es-ES', { minimumFractionDigits: 2 })}`,
      statusBadge: <QuotationStatusBadge status={quotation.status} />,
      actions: <QuotationActionMenu 
                quotation={quotation} 
                onView={() => handleView(quotation)}
                onEdit={() => handleEdit(quotation)}
                onDelete={() => handleDelete(quotation)}
                onStatusChange={(status) => handleStatusChange(quotation, status)}
              />
    };
  });

  const handleRowClick = (row: any) => {
    const originalQuotation = quotations.find(q => q.id === row.id);
    if (originalQuotation) {
      handleView(originalQuotation);
    }
  };

  const handleEditAction = (row: any) => {
    const originalQuotation = quotations.find(q => q.id === row.id);
    if (originalQuotation) {
      handleEdit(originalQuotation);
    }
  };

  const handleDeleteAction = (row: any) => {
    const originalQuotation = quotations.find(q => q.id === row.id);
    if (originalQuotation) {
      handleDelete(originalQuotation);
    }
  };

  return (
    <Card className="bg-transparent shadow-none border-none">
      <CardContent className="p-0">
        <DataGrid
          data={formattedData}
          columns={columns}
          loading={isLoading}
          pageSize={10}
          onRowClick={handleRowClick}
          onEdit={handleEditAction}
          onDelete={handleDeleteAction}
          onReload={onRefresh}
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
