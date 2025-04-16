
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import TableActions from "@/components/common/TableActions";
import TableEmptyState from "@/components/common/TableEmptyState";
import { ContactoCliente } from "../models/client.model";

interface ContactoTableAction<T> {
  handler: (item: T) => void;
  label?: string;
}

export interface ContactosClienteTableProps {
  contactos: ContactoCliente[];
  isLoading?: boolean;
  onEdit?: ContactoTableAction<ContactoCliente>;
  onDelete?: ContactoTableAction<ContactoCliente>;
  emptyStateProps?: {
    title?: string;
    description?: string;
  };
}

export const ContactosClienteTable: React.FC<ContactosClienteTableProps> = ({
  contactos,
  isLoading = false,
  onEdit,
  onDelete,
  emptyStateProps = {
    title: "No se encontraron contactos",
    description: "Este cliente no tiene contactos registrados."
  }
}) => {
  if (isLoading) {
    return (
      <div className="w-full h-32 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando contactos...</div>
      </div>
    );
  }

  if (!contactos || contactos.length === 0) {
    return (
      <TableEmptyState 
        title={emptyStateProps.title} 
        description={emptyStateProps.description}
        className="h-40"
      />
    );
  }

  const handleEdit = (contacto: ContactoCliente) => {
    if (onEdit) onEdit.handler(contacto);
  };

  const handleDelete = (contacto: ContactoCliente) => {
    if (onDelete) onDelete.handler(contacto);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Correo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contactos.map((contacto) => (
            <TableRow key={contacto.id}>
              <TableCell className="font-medium">{contacto.nombre}</TableCell>
              <TableCell>{contacto.cargo || '—'}</TableCell>
              <TableCell>{contacto.telefono || '—'}</TableCell>
              <TableCell>{contacto.correo || '—'}</TableCell>
              <TableCell>
                <Badge variant={contacto.estado ? "default" : "destructive"}>
                  {contacto.estado ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <TableActions
                  row={contacto}
                  onView={false}
                  onEdit={onEdit ? () => handleEdit(contacto) : false}
                  onDelete={onDelete ? () => handleDelete(contacto) : false}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
