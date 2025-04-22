import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { TransportContact } from '../../../transport/models/transport.model';
import { Badge } from '@/components/ui/badge';
import { TableEmptyState } from '@/components/common/TableEmptyState';

interface ContactoTableAction {
  handler: (item: TransportContact) => void;
  label?: string;
}

export interface ContactoTransporteTableProps {
  contactos: TransportContact[];
  isLoading?: boolean;
  onEdit?: ContactoTableAction;
  onDelete?: ContactoTableAction;
  emptyStateProps?: {
    title?: string;
    description?: string;
  };
}

export const ContactoTransporteTable: React.FC<ContactoTransporteTableProps> = ({
  contactos,
  isLoading = false,
  onEdit,
  onDelete,
  emptyStateProps = {
    title: "No hay contactos",
    description: "No hay contactos registrados para este transporte."
  }
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
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

  const handleEdit = (contacto: TransportContact) => {
    if (onEdit) onEdit.handler(contacto);
  };

  const handleDelete = (contacto: TransportContact) => {
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
              <TableCell>{contacto.cargo || "—"}</TableCell>
              <TableCell>{contacto.telefono || "—"}</TableCell>
              <TableCell>{contacto.correo || "—"}</TableCell>
              <TableCell>
                <Badge variant={contacto.estado ? "default" : "secondary"}>
                  {contacto.estado ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                {onEdit && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(contacto)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(contacto)}
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};