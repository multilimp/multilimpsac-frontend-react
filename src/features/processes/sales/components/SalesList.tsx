
import React from 'react';
import { DataGrid } from '@/components/ui/data-grid';
import { Button } from '@/components/ui/button';
import { Download, RefreshCcw } from 'lucide-react';
import { PurchaseOrder } from '@/features/processes/purchase-orders/models/purchaseOrder';
import { useContactView } from '../../processes/sales/hooks/useContactView';
import { SalesDocumentActions } from './SalesDocumentActions';
import { ContactDetailsSheet } from './ContactDetailsSheet';
import { getSalesColumns } from '../utils/salesColumns';

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
  const {
    selectedContact,
    isContactViewOpen,
    setIsContactViewOpen,
    handleViewContact,
  } = useContactView();

  const columns = [
    ...getSalesColumns(handleViewContact),
    {
      key: 'documents',
      name: 'Documentos',
      type: 'string' as const,
      sortable: false,
      filterable: false,
      cell: (row: any) => (
        <SalesDocumentActions 
          documentOce={row.documento_oce}
          documentOcf={row.documento_ocf}
        />
      ),
    },
  ];

  const formattedData = sales.map(sale => ({
    ...sale,
    codigo_venta: sale.orderNumber,
    clientRuc: sale.clientId,
    enterpriseRuc: "RUC-EMPRESA",
    enterpriseName: "NOMBRE-EMPRESA",
    contact: {
      name: "Contact Name",
      phone: "Contact Phone",
      email: "contact@email.com"
    },
  }));

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
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Exportar
        </Button>
      </div>
      
      <DataGrid
        data={formattedData}
        columns={columns}
        loading={isLoading}
      />

      <ContactDetailsSheet
        isOpen={isContactViewOpen}
        onOpenChange={setIsContactViewOpen}
        contact={selectedContact}
      />
    </div>
  );
};

export default SalesList;
