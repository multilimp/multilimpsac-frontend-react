
import React, { useState, useEffect } from "react";
import { 
  Eye, Edit, Trash, FileCheck, FileX, Calendar, Send 
} from "lucide-react";
import { format } from "date-fns";

import DataTable, { Column } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Badge
} from "@/components/ui/badge";
import { Quotation } from "@/data/models/quotation";
import { useToast } from "@/hooks/use-toast";

// Mock data for demonstration
const mockQuotations: Quotation[] = [
  {
    id: "1",
    number: "COT-2023-001",
    clientId: "1",
    clientName: "Empresa ABC",
    date: "2023-09-01",
    expiryDate: "2023-09-30",
    total: 1500.0,
    status: "sent",
    items: [
      {
        id: "1",
        productId: "1",
        productName: "Servicio de Limpieza",
        description: "Limpieza de oficinas",
        quantity: 1,
        unitPrice: 1500.0,
        total: 1500.0,
      },
    ],
    createdBy: "1",
    createdAt: "2023-09-01T10:00:00",
    updatedAt: "2023-09-01T10:00:00",
  },
  {
    id: "2",
    number: "COT-2023-002",
    clientId: "2",
    clientName: "Empresa XYZ",
    date: "2023-09-05",
    expiryDate: "2023-10-05",
    total: 2500.0,
    status: "approved",
    items: [
      {
        id: "2",
        productId: "2",
        productName: "Mantenimiento",
        description: "Mantenimiento de equipos",
        quantity: 2,
        unitPrice: 1250.0,
        total: 2500.0,
      },
    ],
    notes: "Cliente solicita factura a 30 días",
    createdBy: "1",
    createdAt: "2023-09-05T14:30:00",
    updatedAt: "2023-09-06T09:15:00",
  },
  {
    id: "3",
    number: "COT-2023-003",
    clientId: "3",
    clientName: "Corporación DEF",
    date: "2023-09-10",
    expiryDate: "2023-09-25",
    total: 3200.0,
    status: "draft",
    items: [
      {
        id: "3",
        productId: "3",
        productName: "Fumigación",
        description: "Servicio de fumigación completo",
        quantity: 1,
        unitPrice: 3200.0,
        total: 3200.0,
      },
    ],
    createdBy: "2",
    createdAt: "2023-09-10T16:45:00",
    updatedAt: "2023-09-10T16:45:00",
  },
];

const QuotationList: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>(mockQuotations);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleEdit = (quotation: Quotation) => {
    // Implementation for editing
    toast({
      title: "Editar cotización",
      description: `Editando cotización ${quotation.number}`,
    });
  };

  const handleView = (quotation: Quotation) => {
    // Implementation for viewing
    toast({
      title: "Ver cotización",
      description: `Viendo detalles de cotización ${quotation.number}`,
    });
  };

  const handleDelete = (quotation: Quotation) => {
    setSelectedQuotation(quotation);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedQuotation) {
      setQuotations(quotations.filter(q => q.id !== selectedQuotation.id));
      toast({
        title: "Cotización eliminada",
        description: `Se ha eliminado la cotización ${selectedQuotation.number}`,
      });
      setDeleteDialogOpen(false);
    }
  };

  const handleStatusChange = (quotation: Quotation, newStatus: Quotation['status']) => {
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
  };

  const getStatusBadge = (status: Quotation['status']) => {
    const statusConfig: Record<Quotation['status'], { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
      draft: { label: "Borrador", variant: "outline" },
      sent: { label: "Enviada", variant: "secondary" },
      approved: { label: "Aprobada", variant: "default" },
      rejected: { label: "Rechazada", variant: "destructive" },
      expired: { label: "Expirada", variant: "outline" }
    };

    const config = statusConfig[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const columns: Column<Quotation>[] = [
    {
      header: "Número",
      accessorKey: "number",
    },
    {
      header: "Cliente",
      accessorKey: "clientName",
    },
    {
      header: "Fecha",
      accessorKey: "date",
      cell: (quotation) => format(new Date(quotation.date), "dd/MM/yyyy"),
    },
    {
      header: "Expira",
      accessorKey: "expiryDate",
      cell: (quotation) => format(new Date(quotation.expiryDate), "dd/MM/yyyy"),
    },
    {
      header: "Total",
      accessorKey: "total",
      cell: (quotation) => `$${quotation.total.toFixed(2)}`,
    },
    {
      header: "Estado",
      accessorKey: "status",
      cell: (quotation) => getStatusBadge(quotation.status),
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <DataTable 
          columns={columns} 
          data={quotations}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Está seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Esto eliminará permanentemente la cotización
                {selectedQuotation && ` ${selectedQuotation.number}`} y todos sus datos asociados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};

export default QuotationList;
