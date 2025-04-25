
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, RefreshCcw } from 'lucide-react';
import TableEmptyState from '@/components/common/TableEmptyState';

// Temporary mock type until we implement the full functionality
interface Sale {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName?: string;
  clientRuc?: string;
  status: string;
  totalAmount: number;
  date: string;
  documento_oce?: string;
  documento_ocf?: string;
}

interface SalesListProps {
  sales: Sale[];
  isLoading: boolean;
  onRefresh: () => void;
}

const SalesList: React.FC<SalesListProps> = ({ 
  sales, 
  isLoading,
  onRefresh
}) => {
  if (isLoading) {
    return <TableEmptyState loading={true} title="Cargando ventas" message="Obteniendo datos de ventas..." />;
  }

  if (sales.length === 0) {
    return (
      <TableEmptyState 
        title="No hay ventas registradas" 
        message="No se encontraron registros de ventas para mostrar." 
        action={
          <Button onClick={onRefresh} variant="outline" size="sm">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Actualizar
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onRefresh}
        >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>
      
      <div className="border rounded-md p-4">
        <p className="text-center text-gray-500">Lista de ventas (Implementación pendiente)</p>
      </div>
    </div>
  );
};

export default SalesList;
