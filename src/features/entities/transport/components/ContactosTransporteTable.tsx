import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { TransportContact } from '../../../transport/models/transport.model';
import { TableEmptyState } from '@/components/common/TableEmptyState';

interface ContactosTransporteTableProps {
  contactos: TransportContact[];
  isLoading: boolean;
  onAdd: () => void;
  onEdit: (contacto: TransportContact) => void;
  onDelete: (contacto: TransportContact) => void;
}

const ContactosTransporteTable: React.FC<ContactosTransporteTableProps> = ({
  contactos,
  isLoading,
  onAdd,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Contactos</h3>
        <Button size="sm" onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" /> Añadir Contacto
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="text-muted-foreground mt-2">Cargando contactos...</p>
        </div>
      ) : contactos.length === 0 ? (
        <TableEmptyState
          title="No hay contactos registrados"
          description="Añade un nuevo contacto para este transporte"
          action={
            <Button size="sm" onClick={onAdd}>
              <Plus className="h-4 w-4 mr-2" /> Añadir Contacto
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead className="w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contactos.map((contacto) => (
              <TableRow key={contacto.id}>
                <TableCell className="font-medium">{contacto.nombre}</TableCell>
                <TableCell>{contacto.cargo}</TableCell>
                <TableCell>{contacto.email}</TableCell>
                <TableCell>{contacto.telefono}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" onClick={() => onEdit(contacto)} title="Editar">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => onDelete(contacto)} title="Eliminar" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default ContactosTransporteTable;