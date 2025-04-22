
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SupplierContact } from '../models/supplierContact.model';

interface SupplierContactsTableProps {
  contacts: SupplierContact[];
  isLoading: boolean;
  onEdit: (contact: SupplierContact) => void;
  onDelete: (contact: SupplierContact) => void;
}

const SupplierContactsTable: React.FC<SupplierContactsTableProps> = ({
  contacts,
  isLoading,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return <div className="flex justify-center p-4">Cargando contactos...</div>;
  }

  if (contacts.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No hay contactos asociados a este proveedor.
      </div>
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
            <TableHead>Email</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell className="font-medium">{contact.name}</TableCell>
              <TableCell>{contact.position || '—'}</TableCell>
              <TableCell>{contact.phone || '—'}</TableCell>
              <TableCell>{contact.email || '—'}</TableCell>
              <TableCell>
                <Badge variant={contact.status === 'active' ? 'default' : 'secondary'}>
                  {contact.status === 'active' ? 'Activo' : 'Inactivo'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(contact)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onDelete(contact)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SupplierContactsTable;
