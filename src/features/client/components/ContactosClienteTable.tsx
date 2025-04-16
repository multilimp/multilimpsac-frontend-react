
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

interface ContactosClienteTableProps {
  contactos: ContactoCliente[];
  isLoading?: boolean;
  onEdit?: (contacto: ContactoCliente) => void;
  onDelete?: (id: string) => void;
}

export const ContactosClienteTable: React.FC<ContactosClienteTableProps> = ({
  contactos,
  isLoading = false,
  onEdit,
  onDelete,
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
        title="No se encontraron contactos" 
        description="Este cliente no tiene contactos registrados."
        className="h-40"
      />
    );
  }

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
                  onView={false}
                  onEdit={onEdit ? () => onEdit(contacto) : undefined}
                  onDelete={onDelete ? () => onDelete(contacto.id) : undefined}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
