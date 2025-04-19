
import React, { useState } from 'react';
import { DataGrid } from '@/components/ui/data-grid';
import { Button } from '@/components/ui/button';
import { Download, RefreshCcw, Eye, FileText } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PurchaseOrder } from '@/features/purchaseOrder/models/purchaseOrder';
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
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [isContactViewOpen, setIsContactViewOpen] = useState(false);

  const handleViewContact = (contact: any) => {
    setSelectedContact(contact);
    setIsContactViewOpen(true);
  };

  const openDocument = (url: string | undefined) => {
    if (url) {
      window.open(url, '_blank');
    } else {
      toast({
        title: "Documento no disponible",
        description: "No se ha cargado el documento aún",
        variant: "destructive",
      });
    }
  };

  // Define columns for DataGrid
  const columns = [
    {
      key: 'codigo_venta',
      name: 'Código Venta',
      type: 'string' as const,
      sortable: true,
      filterable: true,
    },
    {
      key: 'clientName',
      name: 'Cliente',
      type: 'string' as const,
      sortable: true,
      filterable: true,
    },
    {
      key: 'clientRuc',
      name: 'RUC Cliente',
      type: 'string' as const,
      sortable: true,
      filterable: true,
    },
    {
      key: 'enterpriseRuc',
      name: 'RUC Empresa',
      type: 'string' as const,
      sortable: true,
      filterable: true,
    },
    {
      key: 'enterpriseName',
      name: 'Razón Social Empresa',
      type: 'string' as const,
      sortable: true,
      filterable: true,
    },
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
    {
      key: 'catalogo',
      name: 'Catálogo',
      type: 'string' as const,
      sortable: true,
      filterable: true,
    },
    {
      key: 'fecha_form',
      name: 'Fecha Formalización',
      type: 'date' as const,
      sortable: true,
      filterable: true,
    },
    {
      key: 'fecha_max_form',
      name: 'Fecha Máx. Entrega',
      type: 'date' as const,
      sortable: true,
      filterable: true,
    },
    {
      key: 'monto_venta',
      name: 'Monto Venta',
      type: 'number' as const,
      sortable: true,
      filterable: true,
      cell: (row: any) => formatCurrency(row.monto_venta),
    },
    {
      key: 'cod_unidad',
      name: 'CUE',
      type: 'string' as const,
      sortable: true,
      filterable: true,
    },
    {
      key: 'departamento_entrega',
      name: 'Departamento Entrega',
      type: 'string' as const,
      sortable: true,
      filterable: true,
    },
    {
      key: 'documents',
      name: 'Documentos',
      type: 'string' as const,
      sortable: false,
      filterable: false,
      cell: (row: any) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDocument(row.documento_oce)}
          >
            <FileText className="h-4 w-4 mr-1" />
            OCE
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => openDocument(row.documento_ocf)}
          >
            <FileText className="h-4 w-4 mr-1" />
            OCF
          </Button>
        </div>
      ),
    },
  ];

  // Format data for DataGrid
  const formattedData = sales.map(sale => ({
    ...sale,
    codigo_venta: sale.orderNumber,
    clientRuc: sale.clientId,
    enterpriseRuc: "RUC-EMPRESA", // This should come from your data
    enterpriseName: "NOMBRE-EMPRESA", // This should come from your data
    contact: {
      name: "Contact Name", // This should come from your data
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
      />

      <Sheet open={isContactViewOpen} onOpenChange={setIsContactViewOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Detalles del Contacto</SheetTitle>
          </SheetHeader>
          {selectedContact && (
            <div className="space-y-4 mt-4">
              <div>
                <label className="font-medium">Nombre:</label>
                <p>{selectedContact.name}</p>
              </div>
              <div>
                <label className="font-medium">Teléfono:</label>
                <p>{selectedContact.phone}</p>
              </div>
              <div>
                <label className="font-medium">Email:</label>
                <p>{selectedContact.email}</p>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SalesList;
