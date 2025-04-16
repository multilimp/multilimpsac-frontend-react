
import React, { useState } from 'react';
import { DataGrid, ColumnType } from '@/components/ui/data-grid';
import { Button } from '@/components/ui/button';
import { Download, RefreshCcw, Eye, Edit, Trash2 } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { PurchaseOrder } from '@/features/purchaseOrder/models/purchaseOrder';
import SalesStatusBadge from './SalesStatusBadge';
import { useToast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils';

interface SalesListProps {
  sales: PurchaseOrder[];
  isLoading: boolean;
  onRefresh: () => void;
}

const SalesList: React.FC<SalesListProps> = ({ 
  sales, 
  isLoading,
  onRefresh
}) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<PurchaseOrder | null>(null);

  // Define columns for DataGrid
  const columns = [
    {
      key: 'orderNumber',
      name: 'Nº Venta',
      type: 'string' as ColumnType,
      sortable: true,
      filterable: true,
    },
    {
      key: 'clientName',
      name: 'Cliente',
      type: 'string' as ColumnType,
      sortable: true,
      filterable: true,
    },
    {
      key: 'date',
      name: 'Fecha',
      type: 'date' as ColumnType,
      sortable: true,
      filterable: true,
    },
    {
      key: 'type',
      name: 'Tipo',
      type: 'string' as ColumnType,
      sortable: true,
      filterable: true,
    },
    {
      key: 'total',
      name: 'Total',
      type: 'number' as ColumnType,
      sortable: true,
      filterable: true,
    },
    {
      key: 'status',
      name: 'Estado',
      type: 'string' as ColumnType,
      sortable: true,
      filterable: true,
    },
    {
      key: 'actions',
      name: 'Acciones',
      type: 'string' as ColumnType,
      sortable: false,
      filterable: false,
    },
  ];

  // Handle row actions
  const handleViewSale = (sale: PurchaseOrder) => {
    console.log('View sale:', sale);
    // Implement view logic
  };

  const handleEditSale = (sale: PurchaseOrder) => {
    console.log('Edit sale:', sale);
    // Implement edit logic
  };

  const handleDeleteSale = (sale: PurchaseOrder) => {
    setSelectedSale(sale);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteSale = async () => {
    if (!selectedSale) return;
    
    try {
      // Here you would call the delete API
      console.log('Deleting sale:', selectedSale.id);
      
      toast({
        title: "Venta eliminada",
        description: `La venta ${selectedSale.orderNumber} ha sido eliminada`,
      });
      
      onRefresh();
    } catch (error) {
      console.error('Error deleting sale:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la venta",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setSelectedSale(null);
    }
  };

  // Format data for DataGrid with complete objects
  const formattedData = sales.map(sale => {
    // Create a formatted version but preserve all original properties
    return {
      ...sale, // Keep all original properties
      // Add formatted versions of properties
      formattedType: sale.type === 'public' ? 'Pública' : 'Privada',
      formattedTotal: formatCurrency(sale.total),
      statusBadge: <SalesStatusBadge status={sale.status} />,
      actionButtons: (
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewSale(sale);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEditSale(sale);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteSale(sale);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    };
  });

  const handleRowClick = (row: any) => {
    const originalSale = sales.find(s => s.id === row.id);
    if (originalSale) {
      handleViewSale(originalSale);
    }
  };

  const handleEditAction = (row: any) => {
    const originalSale = sales.find(s => s.id === row.id);
    if (originalSale) {
      handleEditSale(originalSale);
    }
  };

  const handleDeleteAction = (row: any) => {
    const originalSale = sales.find(s => s.id === row.id);
    if (originalSale) {
      handleDeleteSale(originalSale);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onRefresh()}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
        <Button 
          variant="outline" 
          size="sm"
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>
      
      <DataGrid
        data={formattedData}
        columns={columns}
        loading={isLoading}
        onRowClick={handleRowClick}
        onEdit={handleEditAction}
        onDelete={handleDeleteAction}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la venta
              {selectedSale && ` ${selectedSale.orderNumber}`} y los datos asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteSale} className="bg-destructive">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SalesList;
