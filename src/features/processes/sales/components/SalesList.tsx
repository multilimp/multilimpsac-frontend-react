
import React from 'react';
import { DataTable, DataTableColumn } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { TableEmptyState } from '@/components/common/TableEmptyState';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Eye, FileText } from 'lucide-react';
import { formatDate, formatCurrency } from '@/utils/formatters';

export interface Sale {
  id: string;
  companyName: string;
  clientName: string;
  contactName: string;
  date: string;
  totalAmount: number;
  status: 'draft' | 'pending' | 'completed' | 'cancelled';
}

interface SalesListProps {
  sales: Sale[];
  isLoading: boolean;
  onRefresh: () => void;
}

const STATUS_COLORS = {
  draft: 'bg-gray-200 text-gray-800',
  pending: 'bg-yellow-200 text-yellow-800',
  completed: 'bg-green-200 text-green-800',
  cancelled: 'bg-red-200 text-red-800',
};

const STATUS_LABELS = {
  draft: 'Borrador',
  pending: 'Pendiente',
  completed: 'Completada',
  cancelled: 'Cancelada',
};

const SalesList: React.FC<SalesListProps> = ({ sales, isLoading, onRefresh }) => {
  const navigate = useNavigate();
  
  const handleRowClick = (sale: Sale) => {
    navigate(`/ventas/${sale.id}`);
  };
  
  const columns: DataTableColumn<Sale>[] = [
    {
      id: 'date',
      header: 'Fecha',
      accessorKey: 'date',
      cell: ({ row }) => formatDate(row.original.date),
    },
    {
      id: 'companyName',
      header: 'Empresa',
      accessorKey: 'companyName',
    },
    {
      id: 'clientName',
      header: 'Cliente',
      accessorKey: 'clientName',
    },
    {
      id: 'contactName',
      header: 'Contacto',
      accessorKey: 'contactName',
    },
    {
      id: 'totalAmount',
      header: 'Monto Total',
      accessorKey: 'totalAmount',
      cell: ({ row }) => formatCurrency(row.original.totalAmount),
    },
    {
      id: 'status',
      header: 'Estado',
      accessorKey: 'status',
      cell: ({ row }) => (
        <Badge variant="outline" className={STATUS_COLORS[row.original.status]}>
          {STATUS_LABELS[row.original.status]}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/ventas/${row.original.id}`);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/ventas/${row.original.id}/pdf`);
            }}
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
  
  if (sales.length === 0 && !isLoading) {
    return (
      <TableEmptyState 
        title="No hay ventas registradas" 
        description="Crea una nueva venta para comenzar."
      />
    );
  }
  
  return (
    <DataTable
      data={sales}
      columns={columns}
      onRowClick={handleRowClick}
      isLoading={isLoading}
      onReload={onRefresh}
      searchPlaceholder="Buscar ventas..."
    />
  );
};

export default SalesList;
