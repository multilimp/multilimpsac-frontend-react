
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { SupplierContact } from '../models/supplierContact.model';
import SupplierContactsTable from './SupplierContactsTable';

interface SupplierContactsTabProps {
  contacts: SupplierContact[];
  isLoading: boolean;
  onAddContact: () => void;
  onEditContact: (contact: SupplierContact) => void;
  onDeleteContact: (contact: SupplierContact) => void;
}

const SupplierContactsTab: React.FC<SupplierContactsTabProps> = ({
  contacts,
  isLoading,
  onAddContact,
  onEditContact,
  onDeleteContact,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center">
          <Users className="mr-2 h-5 w-5 text-muted-foreground" />
          Contactos
        </h2>
        <Button onClick={onAddContact}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Contacto
        </Button>
      </div>
      
      <Card>
        <div className="p-6">
          <SupplierContactsTable
            contacts={contacts}
            isLoading={isLoading}
            onEdit={onEditContact}
            onDelete={onDeleteContact}
          />
        </div>
      </Card>
    </div>
  );
};

export default SupplierContactsTab;
