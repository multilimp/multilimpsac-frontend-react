
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { TransportContact } from '../models/transport.model';
import ContactoTransporteFormDialog from './ContactoTransporteFormDialog';

interface ContactoTransporteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contacto: TransportContact | null;
  transporteId: string;
  onSubmit: (data: Partial<TransportContact>) => Promise<void>;
  isSubmitting?: boolean;
}

const ContactoTransporteDialog: React.FC<ContactoTransporteDialogProps> = ({
  isOpen,
  onClose,
  contacto,
  transporteId,
  onSubmit,
  isSubmitting = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {contacto?.id ? 'Editar Contacto' : 'Nuevo Contacto'}
          </DialogTitle>
        </DialogHeader>
        
        <ContactoTransporteFormDialog
          contacto={contacto}
          transporteId={transporteId}
          onSubmit={onSubmit}
          onCancel={onClose}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default ContactoTransporteDialog;
