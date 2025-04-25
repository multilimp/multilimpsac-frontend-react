
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { TransportContact } from '../models/transport.model';
import ContactosTransporteTable from './ContactosTransporteTable';

interface ContactosTransporteTabProps {
  contactos: TransportContact[];
  isLoading: boolean;
  onAddContacto: () => void;
  onEditContacto: (contacto: TransportContact) => void;
  onDeleteContacto: (contacto: TransportContact) => void;
}

const ContactosTransporteTab: React.FC<ContactosTransporteTabProps> = ({
  contactos,
  isLoading,
  onAddContacto,
  onEditContacto,
  onDeleteContacto
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Contactos</h2>
        <Button onClick={onAddContacto}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Contacto
        </Button>
      </div>
      
      <ContactosTransporteTable 
        contactos={contactos}
        isLoading={isLoading}
        onAdd={onAddContacto}
        onEdit={onEditContacto}
        onDelete={onDeleteContacto}
      />
    </div>
  );
};

export default ContactosTransporteTab;
