
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ContactosClienteTable } from './ContactosClienteTable';
import { ContactoCliente } from '../models/client.model';

interface ContactosClienteTabProps {
  contactos: ContactoCliente[];
  isLoading: boolean;
  onAddContacto: () => void;
  onEditContacto: (contacto: ContactoCliente) => void;
  onDeleteContacto: (contacto: ContactoCliente) => void;
}

const ContactosClienteTab: React.FC<ContactosClienteTabProps> = ({
  contactos,
  isLoading,
  onAddContacto,
  onEditContacto,
  onDeleteContacto
}) => {
  return (
    <TabsContent value="contactos">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Contactos</h2>
        <Button onClick={onAddContacto}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar Contacto
        </Button>
      </div>
      
      <ContactosClienteTable 
        contactos={contactos}
        isLoading={isLoading}
        onEdit={onEditContacto}
        onDelete={onDeleteContacto}
      />
    </TabsContent>
  );
};

export default ContactosClienteTab;
