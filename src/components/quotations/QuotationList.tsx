
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
import { fetchQuotations, updateQuotationStatus, deleteQuotation } from "@/data/services/quotationService";

const QuotationList: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

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
          loading={isLoading}
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
