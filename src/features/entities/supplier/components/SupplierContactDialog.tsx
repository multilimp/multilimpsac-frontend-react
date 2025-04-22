
import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { SupplierContact } from '../models/supplierContact.model';
import SupplierContactForm from './SupplierContactForm';

interface SupplierContactDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contact: SupplierContact | null;
  onSubmit: (data: Partial<SupplierContact>) => Promise<void>;
  isLoading?: boolean;
}

const SupplierContactDialog: React.FC<SupplierContactDialogProps> = ({
  isOpen,
  onClose,
  contact,
  onSubmit,
  isLoading = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {contact?.id ? 'Editar Contacto' : 'Nuevo Contacto'}
          </DialogTitle>
        </DialogHeader>
        
        <SupplierContactForm
          contact={contact}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};

export default SupplierContactDialog;
