import React from 'react';
import { Card } from '@/components/ui/card';
import { TransportContact } from '../../../transport/models/transport.model';
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
  onDeleteContacto,
}) => {
  return (
    <Card>
      <div className="p-6">
        <ContactosTransporteTable
          contactos={contactos}
          isLoading={isLoading}
          onAdd={onAddContacto}
          onEdit={onEditContacto}
          onDelete={onDeleteContacto}
        />
      </div>
    </Card>
  );
};

export default ContactosTransporteTab;