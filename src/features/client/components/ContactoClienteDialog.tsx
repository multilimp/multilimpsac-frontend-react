
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { ContactoClienteForm } from './ContactoClienteForm';
import { ContactoCliente } from '../models/client.model';

interface ContactoClienteDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contacto: ContactoCliente | null;
  clienteId: string;
  onSubmit: (data: Partial<ContactoCliente>) => Promise<void>;
  isSubmitting: boolean;
}

const ContactoClienteDialog: React.FC<ContactoClienteDialogProps> = ({
  isOpen,
  onOpenChange,
  contacto,
  clienteId,
  onSubmit,
  isSubmitting
}) => {
  const isNew = !contacto;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isNew ? 'Nuevo Contacto' : 'Editar Contacto'}
          </DialogTitle>
          <DialogDescription>
            {isNew 
              ? 'Complete los datos para agregar un nuevo contacto'
              : 'Actualice los datos del contacto'}
          </DialogDescription>
        </DialogHeader>
        <ContactoClienteForm 
          clienteId={clienteId}
          initialData={contacto || undefined}
          onSubmit={onSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ContactoClienteDialog;
