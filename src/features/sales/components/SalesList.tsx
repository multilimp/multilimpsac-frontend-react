
import React from 'react';
import { DataGrid } from '@/components/ui/data-grid';
import { Button } from '@/components/ui/button';
import { Download, RefreshCcw, Eye } from 'lucide-react';
import { PurchaseOrder } from '@/features/purchaseOrder/models/purchaseOrder';
import { formatCurrency } from '@/lib/utils';
import { useContactView } from '../hooks/useContactView';
import { SalesDocumentActions } from './SalesDocumentActions';
import { ContactDetailsSheet } from './ContactDetailsSheet';

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
    { key: 'codigo_venta', name: 'Código Venta', type: 'string' as const, sortable: true, filterable: true },
    { key: 'clientName', name: 'Cliente', type: 'string' as const, sortable: true, filterable: true },
    { key: 'clientRuc', name: 'RUC Cliente', type: 'string' as const, sortable: true, filterable: true },
    { key: 'enterpriseRuc', name: 'RUC Empresa', type: 'string' as const, sortable: true, filterable: true },
    { key: 'enterpriseName', name: 'Razón Social Empresa', type: 'string' as const, sortable: true, filterable: true },
    {
      key: 'contact',
      name: 'Contacto',
      type: 'string' as const,
      sortable: false,
      filterable: false,
      cell: (row: any) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleViewContact(row.contact)}
        >
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
    { key: 'catalogo', name: 'Catálogo', type: 'string' as const, sortable: true, filterable: true },
    { key: 'fecha_form', name: 'Fecha Formalización', type: 'date' as const, sortable: true, filterable: true },
    { key: 'fecha_max_form', name: 'Fecha Máx. Entrega', type: 'date' as const, sortable: true, filterable: true },
    {
      key: 'monto_venta',
      name: 'Monto Venta',
      type: 'number' as const,
      sortable: true,
      filterable: true,
      cell: (row: any) => formatCurrency(row.monto_venta),
    },
    { key: 'cod_unidad', name: 'CUE', type: 'string' as const, sortable: true, filterable: true },
    { key: 'departamento_entrega', name: 'Departamento Entrega', type: 'string' as const, sortable: true, filterable: true },
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
