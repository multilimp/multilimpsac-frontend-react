
import React from "react";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataGrid } from "@/components/ui/data-grid";
import { Cliente } from "@/features/client/models/client.model";

interface ClientSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (client: Cliente) => void;
  clients: Cliente[];
}

export const ClientSelectionModal: React.FC<ClientSelectionModalProps> = ({
  open,
  onOpenChange,
  onSelect,
  clients
}) => {
  const columns = [
    { 
      key: "ruc",
      name: "RUC",
      type: "string" as const,
      sortable: true,
      filterable: true,
    },
    { 
      key: "razonSocial",
      name: "Razón Social",
      type: "string" as const,
      sortable: true,
      filterable: true,
    },
    { 
      key: "codUnidad",
      name: "Código Unidad",
      type: "string" as const,
      sortable: true,
      filterable: true,
    },
    { 
      key: "departamento",
      name: "Departamento",
      type: "string" as const,
      sortable: true,
      filterable: true,
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Seleccionar Cliente</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <DataGrid
            data={clients}
            columns={columns}
            pageSize={5}
            onRowClick={(row) => {
              onSelect(row as Cliente);
              onOpenChange(false);
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
