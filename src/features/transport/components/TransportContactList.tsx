
import { Button } from "@/components/ui/button";
import DataTable, { Column } from "@/components/common/DataTable";
import { Plus } from "lucide-react";
import { useState } from "react";
import { ContactoTransporte } from "../models/transport.model";
import TransportContactDialog from "./TransportContactDialog";

interface TransportContactListProps {
  transportId: string;
  contacts: ContactoTransporte[];
  onEdit: (contact: ContactoTransporte) => void;
  onDelete: (contact: ContactoTransporte) => void;
  onAdd: () => void;
  isLoading?: boolean;
}

const TransportContactList = ({
  transportId,
  contacts,
  onEdit,
  onDelete,
  onAdd,
  isLoading
}: TransportContactListProps) => {
  const [selectedContact, setSelectedContact] = useState<ContactoTransporte | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const columns: Column<ContactoTransporte>[] = [
    {
      header: "Nombre",
      accessorKey: "nombre"
    },
    {
      header: "Cargo",
      accessorKey: "cargo"
    },
    {
      header: "Teléfono",
      accessorKey: "telefono"
    },
    {
      header: "Correo",
      accessorKey: "correo"
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Contactos</h2>
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Agregar Contacto
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={contacts}
        loading={isLoading}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default TransportContactList;
