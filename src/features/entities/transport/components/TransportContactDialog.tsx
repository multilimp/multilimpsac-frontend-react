
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { TransportContact } from '../models/transportContact.model';
import TransportContactForm from './TransportContactForm';

interface TransportContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contact: TransportContact | null;
  onSubmit: (data: Partial<TransportContact>) => Promise<void>;
  isLoading?: boolean;
}

const TransportContactDialog: React.FC<TransportContactDialogProps> = ({
  isOpen,
  onClose,
  contact,
  onSubmit,
  isLoading = false
}) => {
  const handleSubmit = async (data: Partial<TransportContact>) => {
    await onSubmit(data);
    // Void the return value to match the expected void Promise
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {contact?.id ? 'Editar Contacto' : 'Nuevo Contacto'}
          </DialogTitle>
        </DialogHeader>
        
        <TransportContactForm
          contact={contact}
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default TransportContactDialog;
