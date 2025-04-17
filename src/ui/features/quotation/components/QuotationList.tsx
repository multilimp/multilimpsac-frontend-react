
import React from 'react';
import { DataGrid, DataGridColumn } from '@/components/ui/data-grid';
import { Card, CardContent } from '@/components/ui/card';
import { Quotation } from '@/domain/quotation/models/quotation.model';
import DeleteQuotationDialog from './DeleteQuotationDialog';
import { useQuotationActions } from '../hooks/useQuotationActions';
import { formatQuotationData } from '../utils/formatQuotationData';
import { useToast } from '@/hooks/use-toast';

interface QuotationListProps {
  quotations: Quotation[];
  isLoading: boolean;
  onRefresh: () => void;
  onEdit: (id: string) => void;
}

const QuotationList: React.FC<QuotationListProps> = ({
  quotations,
  isLoading,
  onRefresh,
  onEdit
}) => {
  const { toast } = useToast();
  const {
    selectedQuotation,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleView,
    handleEdit: handleEditAction,
    handleDelete,
    confirmDelete,
    handleStatusChange
  } = useQuotationActions(onRefresh);

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

  // Handler for editing quotations that uses the prop
  const handleEdit = (quotation: Quotation) => {
    onEdit(quotation.id);
  };

  // Format data for the grid
  const formattedData = formatQuotationData(
    quotations,
    handleView,
    handleEdit,
    handleDelete,
    handleStatusChange
  );

  const handleRowClick = (row: any) => {
    const originalQuotation = quotations.find(q => q.id === row.id);
    if (originalQuotation) {
      handleView(originalQuotation);
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
